// tests/modelHooks.test.tsx

import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { z } from "zod";

import {
    CtxContext,
    createUseCreateModelHook,
    createUseFetchModelHook,
    createUseFetchModelListHook,
    createUseFetchModelListInfiniteHook,
} from "../src/hooks/modelHooks";

// --------------------
// Helper Types & Schemas
// --------------------

interface TestModel {
    id: number;
    name: string;
}
const testSchema = z.object({
    id: z.number(),
    name: z.string(),
});
type TestCtx = { branchId: number;[key: string]: any };

// Wrapper that provides SWRConfig and CtxContext
const wrapper =
    (ctxValue: TestCtx) =>
        ({ children }: { children: React.ReactNode }) => {
            return (
                <SWRConfig
                    value={{
                        dedupingInterval: 0,
                        provider: () => new Map(),
                    }}
                >
                    <CtxContext.Provider value={ctxValue}>{children}</CtxContext.Provider>
                </SWRConfig>
            );
        };

// Mock global.fetch before each test
beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
});

// --------------------
// Tests for createUseFetchModelHook
// --------------------

describe("createUseFetchModelHook", () => {
    const useFetchModel = createUseFetchModelHook<TestModel, TestCtx>({
        url: "/api/ai/model/test",
        schema: testSchema,
    });

    it("does not call fetch when id is undefined", () => {
        const { result } = renderHook(() => useFetchModel({ id: undefined }), {
            wrapper: wrapper({ branchId: 1 }),
        });
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeUndefined();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("calls fetch with correct URL including nested ctx param", async () => {
        const sampleData = { id: 42, name: "Alice" };
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => sampleData,
        });

        const ctxValue = { branchId: 1, partitionId: "p1" };
        const { result } = renderHook(
            () =>
                useFetchModel({
                    id: 42,
                    headers: { "X-Test": "true" },
                }),
            { wrapper: wrapper(ctxValue) }
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            // Parse the called URL
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/42");
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual(ctxValue);

            // Check that fetch options include headers: at least Content-Type and X-Test
            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1];
            expect(fetchOptions.method).toBe("GET");
            expect(fetchOptions.headers["Content-Type"]).toBe("application/json");
            expect(fetchOptions.headers["X-Test"]).toBe("true");

            expect(result.current.data).toEqual(sampleData);
            expect(result.current.error).toBeUndefined();
        });
    });

    it("supports lazy fetching via trigger()", async () => {
        const sampleData = { id: 7, name: "Bob" };
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => sampleData,
        });

        const ctxValue = { branchId: 2, foo: "bar" };
        const { result } = renderHook(
            () =>
                useFetchModel({
                    id: 7,
                    lazy: true,
                }),
            { wrapper: wrapper(ctxValue) }
        );

        expect(result.current.data).toBeUndefined();
        expect(global.fetch).not.toHaveBeenCalled();

        // Call trigger to start fetch
        act(() => {
            result.current.trigger();
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/7");
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual(ctxValue);

            expect(result.current.data).toEqual(sampleData);
        });
    });

    it("sets error when response fails Zod validation", async () => {
        // Return invalid shape: missing "name"
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 99 }),
        });

        const ctxValue = { branchId: 3 };
        const { result } = renderHook(
            () =>
                useFetchModel({
                    id: 99,
                }),
            { wrapper: wrapper(ctxValue) }
        );

        await waitFor(() => {
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toMatch(/name/);
        });
    });
});

// --------------------
// Tests for createUseFetchModelListHook
// --------------------

describe("createUseFetchModelListHook", () => {
    const useFetchModelList = createUseFetchModelListHook<TestModel, TestCtx>({
        url: "/api/ai/model/test/list",
        schema: testSchema,
    });

    it("does not call fetch when isDisabled is true", () => {
        const { result } = renderHook(
            () =>
                useFetchModelList({
                    limit: 5,
                    offset: 0,
                    isDisabled: true,
                }),
            { wrapper: wrapper({ branchId: 1 }) }
        );
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeUndefined();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("fetches list with correct URL including nested ctx, list, and filter params", async () => {
        const rawList = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ];
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => rawList,
        });

        const ctxValue = { branchId: 4, extra: "ctxVal" };
        const { result } = renderHook(
            () =>
                useFetchModelList({
                    limit: 5,
                    offset: 10,
                    orderby: "name",
                    direction: "asc",
                    filters: [], // no additional filter string
                    headers: { "X-Test": "true" },
                }),
            { wrapper: wrapper(ctxValue) }
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/list");

            // Check ctx param
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual(ctxValue);

            // Check list param
            const listParam = url.searchParams.get("list");
            expect(listParam).not.toBeNull();
            const parsedList = JSON.parse(decodeURIComponent(listParam!));
            expect(parsedList).toEqual({
                limit: 5,
                offset: 10,
                orderby: "name",
                direction: "asc",
            });

            // No filter param since filters array is empty
            expect(url.searchParams.get("filter")).toBeNull();

            // Check headers include Content-Type and X-Test
            const fetchOptions = (global.fetch as jest.Mock).mock.calls[0][1];
            expect(fetchOptions.method).toBe("GET");
            expect(fetchOptions.headers["Content-Type"]).toBe("application/json");
            expect(fetchOptions.headers["X-Test"]).toBe("true");

            expect(result.current.data).toEqual(rawList);
            expect(result.current.error).toBeUndefined();
        });
    });

    it("applies Zod validation error for list items", async () => {
        // One valid, one invalid
        const invalidList = [{ id: 1, name: "Alice" }, { id: 2 }];
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => invalidList,
        });

        const ctxValue = { branchId: 5 };
        const { result } = renderHook(
            () =>
                useFetchModelList({
                    limit: 3,
                    offset: 0,
                }),
            { wrapper: wrapper(ctxValue) }
        );

        await waitFor(() => {
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toMatch(/name/);
        });
    });

    it("supports lazy fetching via trigger()", async () => {
        const rawList = [{ id: 9, name: "Carol" }];
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => rawList,
        });

        const ctxValue = { branchId: 6 };
        const { result } = renderHook(
            () =>
                useFetchModelList({
                    limit: 1,
                    offset: 0,
                    lazy: true,
                }),
            { wrapper: wrapper(ctxValue) }
        );

        expect(result.current.data).toBeUndefined();
        expect(global.fetch).not.toHaveBeenCalled();

        act(() => {
            result.current.trigger();
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/list");

            // Check ctx param
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual(ctxValue);

            // Check list param with only limit & offset
            const listParam = url.searchParams.get("list");
            expect(listParam).not.toBeNull();
            const parsedList = JSON.parse(decodeURIComponent(listParam!));
            expect(parsedList).toEqual({ limit: 1, offset: 0 });

            expect(result.current.data).toEqual(rawList);
        });
    });
});







// --------------------
// Tests for createUseFetchModelListInfiniteHook
// --------------------

describe("createUseFetchModelListInfiniteHook", () => {
    const useFetchModelListInfinite = createUseFetchModelListInfiniteHook<
        TestModel,
        TestCtx
    >({
        url: "/api/ai/model/test/list",
        schema: testSchema,
    });

    it("does not fetch when isDisabled is true", () => {
        const { result } = renderHook(
            () =>
                useFetchModelListInfinite({
                    pageSize: 2,
                    defaultFilters: [],
                    limit: 2,
                    offset: 0,
                    isDisabled: true,
                }),
            { wrapper: wrapper({ branchId: 1 }) }
        );
        expect(result.current.items).toEqual([]);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("fetches first page and flattens items", async () => {
        const page1 = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ];
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => page1,
        });

        const { result } = renderHook(
            () =>
                useFetchModelListInfinite({
                    pageSize: 2,
                    defaultFilters: [],
                    limit: 2,
                    offset: 0,
                }),
            { wrapper: wrapper({ branchId: 2 }) }
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/list");

            // ctx param
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual({ branchId: 2 });

            // list param: limit=2, offset=0
            const listParam = url.searchParams.get("list");
            expect(listParam).not.toBeNull();
            const parsedList = JSON.parse(decodeURIComponent(listParam!));
            expect(parsedList).toEqual({ limit: 2, offset: 0 });

            expect(result.current.items).toEqual(page1);
        });
    });

    it("appends second page when setSize increases", async () => {
        const page1 = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ];
        const page2 = [
            { id: 3, name: "Carol" },
            { id: 4, name: "Dave" },
        ];
        // @ts-ignore
        global.fetch
            .mockResolvedValueOnce({ ok: true, json: async () => page1 }) // page 0
            .mockResolvedValueOnce({ ok: true, json: async () => page2 }); // page 1

        const { result } = renderHook(
            () =>
                useFetchModelListInfinite({
                    pageSize: 2,
                    defaultFilters: [],
                    limit: 2,
                    offset: 0,
                }),
            { wrapper: wrapper({ branchId: 3 }) }
        );

        // Wait for first page
        await waitFor(() => {
            expect(result.current.items).toEqual(page1);
        });

        // Trigger second page
        act(() => {
            result.current.setSize(2);
        });

        await waitFor(() => {
            // Check combined items
            expect(result.current.items).toEqual([...page1, ...page2]);
        });
    });

    it("respects filters in infinite scroll", async () => {
        const page1 = [{ id: 5, name: "Eve" }];
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => page1,
        });

        const { result } = renderHook(
            () =>
                useFetchModelListInfinite({
                    pageSize: 1,
                    defaultFilters: [{ field: "name", operator: "contains", value: "E" }],
                    limit: 1,
                    offset: 0,
                }),
            { wrapper: wrapper({ branchId: 4, extra: "ctxVal" }) }
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
            const url = new URL(calledUrl, "http://localhost");
            expect(url.pathname).toBe("/api/ai/model/test/list");

            // ctx param
            const ctxParam = url.searchParams.get("ctx");
            expect(ctxParam).not.toBeNull();
            expect(JSON.parse(decodeURIComponent(ctxParam!))).toEqual({ branchId: 4, extra: "ctxVal" });

            // list param: limit=1, offset=0
            const listParam = url.searchParams.get("list");
            expect(listParam).not.toBeNull();
            const parsedList = JSON.parse(decodeURIComponent(listParam!));
            expect(parsedList).toEqual({ limit: 1, offset: 0 });

            // filter param is stringified queryString
            const filterParam = url.searchParams.get("filter");
            expect(filterParam).toBeDefined();
            // queryString for one filter: e.g. field:value or JSON of filters—just check presence
            expect(decodeURIComponent(filterParam!)).toContain("E");

            expect(result.current.items).toEqual(page1);
        });
    });
});










// --------------------
// Tests for createUseCreateModelHook
// --------------------

describe("createUseCreateModelHook", () => {
    interface NewModel {
        id: number;
        name: string;
    }
    interface CreatePayload {
        name: string;
    }
    const newSchema = z.object({
        id: z.number(),
        name: z.string(),
    });

    const useCreateModel = createUseCreateModelHook<
        NewModel,
        CreatePayload,
        TestCtx
    >({
        url: "/api/ai/model/test/create",
        schema: newSchema,
    });

    it("sends correct request body including nested ctx and payload", async () => {
        const created: NewModel = { id: 10, name: "Zara" };
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => created,
        });

        const ctxValue = { branchId: 7, partitionId: "A1" };
        const { result } = renderHook(
            () => useCreateModel({ ctx: ctxValue, headers: { "X-Test": "true" } }),
            { wrapper: wrapper({ branchId: 7, partitionId: "A1" }) }
        );

        let response: any;
        await act(async () => {
            response = await result.current.trigger({ name: "Zara" });
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [calledUrl, options] = (global.fetch as jest.Mock).mock.calls[0];
        expect(calledUrl).toBe("/api/ai/model/test/create");
        expect(options.method).toBe("POST");
        expect(options.headers["Content-Type"]).toBe("application/json");
        expect(options.headers["X-Test"]).toBe("true");

        const sentBody = JSON.parse(options.body);
        expect(sentBody).toEqual({
            name: "Zara",
            ctx: ctxValue,
        });
        expect(response).toEqual(created);
    });

    it("throws when response fails Zod validation", async () => {
        // Return invalid shape: missing "id"
        // @ts-ignore
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name: "NoID" }),
        });

        const ctxValue = { branchId: 8 };
        const { result } = renderHook(
            () => useCreateModel({ ctx: ctxValue }),
            { wrapper: wrapper({ branchId: 8 }) }
        );

        let error: any;
        await act(async () => {
            try {
                await result.current.trigger({ name: "NoID" });
            } catch (e) {
                error = e;
            }
        });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/id/);
    });
});





