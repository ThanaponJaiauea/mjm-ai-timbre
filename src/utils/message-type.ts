/** @format */

import {InferUITools, JSONValue, UIMessage, UIMessagePart} from "ai";
import z from "zod";

export const metadataSchema = z.object({});

type MyMetadata = z.infer<typeof metadataSchema>;

export type MyDataPart = z.infer<any>;

export type MyToolSet = InferUITools<any>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyToolSet>;

export type MyUIMessagePart = UIMessagePart<MyDataPart, MyToolSet>;

export type MyProviderMetadata = Record<string, Record<string, JSONValue>>;
