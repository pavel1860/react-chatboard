import { InputStyleProps } from "./types";
import { z } from "zod";
export declare function fieldExistsInSchema(schema: z.ZodTypeAny, fieldPath: string): boolean;
export declare function getZodFieldByPath(schema: z.ZodTypeAny, path: Array<string | number>): z.ZodTypeAny | undefined;
export declare const useInputStyle: (props: InputStyleProps) => {
    variant: any;
    radius: any;
    size: any;
    color: any;
    inputWidth: any;
    labelWidth: any;
    isReadOnly: any;
};
export declare const useFieldValues: (fieldPath: string) => {
    label: string;
    value: string;
}[];
//# sourceMappingURL=form-utils.d.ts.map