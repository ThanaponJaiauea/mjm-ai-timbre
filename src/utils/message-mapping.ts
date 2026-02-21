/** @format */

import { MyUIMessagePart } from "./message-type";

export const mapDBPartToUIMessagePart = (part: any): MyUIMessagePart => {
  switch (part.type) {
    case "text":
      return {
        type: part.type,
        text: part.text_text!,
      };
    case "reasoning":
      return {
        type: part.type,
        text: part.reasoning_text!,
        providerMetadata: part.provider_metadata ?? undefined,
      };
    case "file":
      return {
        type: part.type,
        mediaType: part.file_media_type!,
        filename: part.file_filename!,
        url: part.file_url!,
      };
    case "source-document":
      return {
        type: part.type,
        sourceId: part.source_document_source_id!,
        mediaType: part.source_document_media_type!,
        title: part.source_document_title!,
        filename: part.source_document_filename!,
        providerMetadata: part.provider_metadata ?? undefined,
      };
    case "source-url":
      return {
        type: part.type,
        sourceId: part.source_url_source_id!,
        url: part.source_url_url!,
        title: part.source_url_title!,
        providerMetadata: part.provider_metadata ?? undefined,
      };
    case "step-start":
      return {
        type: part.type,
      };
    case "tool-ai-recommend":
      if (!part.tool_state) {
        throw new Error("webSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-ai-recommend",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_aiRecommend_input!,
          };
        case "input-available":
          return {
            type: "tool-ai-recommend",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_aiRecommend_input!,
          };
        case "output-available":
          return {
            type: "tool-ai-recommend",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_aiRecommend_input!,
            output: part.tool_aiRecommend_output!,
          };
        case "output-error":
          return {
            type: "tool-ai-recommend",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_aiRecommend_input!,
            errorText: part.tool_errorText!,
          };
      }

    default:
      throw new Error(`Unsupported part type: ${part.type}`);
  }
};
