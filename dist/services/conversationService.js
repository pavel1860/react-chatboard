// import createModelService from "react-chatboard/src/model/services/model-service2";
import { createUseCreateModelHook, createUseFetchModelHook, createUseFetchModelListInfiniteHook, createUseUpdateModelHook } from "../hooks/modelHooks";
import { z } from "zod";
const ConversationPayloadSchema = z.object({
    name: z.string().nullable(),
    avatar: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    platform: z.string().nullable(),
    provider: z.string().nullable(),
    turns: z.array(z.any()),
    participants: z.array(z.any()),
});
const ConversationSchema = z.object({
    id: z.string(),
    createdAt: z.preprocess((val) => typeof val === "string" ? new Date(val) : val, z.date()),
    updatedAt: z.preprocess((val) => typeof val === "string" ? new Date(val) : val, z.date()),
    ...ConversationPayloadSchema.shape,
});
// const {
//     useModelList: useConversationList,
//     useModel: useConversation,
//     useCreateModel: useCreateConversation,
//     useUpdateModel: useUpdateConversation,
// } = createModelService<ConversationType, ConversationPayloadType>("Partition", ConversationSchema)
const useConversationList = createUseFetchModelListInfiniteHook({
    url: "/api/ai/model/Partition/list",
    schema: ConversationSchema
});
const useConversation = createUseFetchModelHook({
    url: "/api/ai/model/Partition/record",
    schema: ConversationSchema
});
const useCreateConversation = createUseCreateModelHook({
    url: "/api/ai/model/Partition/create",
    schema: ConversationSchema
});
const useUpdateConversation = createUseUpdateModelHook({
    url: "/api/ai/model/Partition/update",
    schema: ConversationSchema
});
export { useConversationList, useConversation, useCreateConversation, useUpdateConversation, };
//# sourceMappingURL=conversationService.js.map