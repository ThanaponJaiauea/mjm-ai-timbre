/** @format */

import {MyUIMessagePart} from "./message-type";

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
    case "tool-webSearch":
      if (!part.tool_state) {
        throw new Error("webSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-webSearch",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_webSearch_input!,
          };
        case "input-available":
          return {
            type: "tool-webSearch",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_webSearch_input!,
          };
        case "output-available":
          return {
            type: "tool-webSearch",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_webSearch_input!,
            output: part.tool_webSearch_output!,
          };
        case "output-error":
          return {
            type: "tool-webSearch",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_webSearch_input!,
            errorText: part.tool_errorText!,
          };
      }

    case "tool-songSearch":
      if (!part.tool_state) {
        throw new Error("songSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-songSearch",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_songSearch_input!,
          };
        case "input-available":
          return {
            type: "tool-songSearch",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_songSearch_input!,
          };
        case "output-available":
          return {
            type: "tool-songSearch",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_songSearch_input!,
            output: part.tool_songSearch_output!,
          };
        case "output-error":
          return {
            type: "tool-songSearch",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_songSearch_input!,
            errorText: part.tool_errorText!,
          };
      }

    case "tool-playSongDemo":
      if (!part.tool_state) {
        throw new Error("songSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-playSongDemo",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_playSongDemo_input!,
          };
        case "input-available":
          return {
            type: "tool-playSongDemo",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_playSongDemo_input!,
          };
        case "output-available":
          return {
            type: "tool-playSongDemo",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_playSongDemo_input!,
            output: part.tool_playSongDemo_output!,
          };
        case "output-error":
          return {
            type: "tool-playSongDemo",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_playSongDemo_input!,
            errorText: part.tool_errorText!,
          };
      }

    case "tool-generateSampleTool":
      if (!part.tool_state) {
        throw new Error("songSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-generateSampleTool",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateSampleTool_input!,
          };
        case "input-available":
          return {
            type: "tool-generateSampleTool",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateSampleTool_input!,
          };
        case "output-available":
          return {
            type: "tool-generateSampleTool",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateSampleTool_input!,
            output: part.tool_generateSampleTool_output!,
          };
        case "output-error":
          return {
            type: "tool-generateSampleTool",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateSampleTool_input!,
            errorText: part.tool_errorText!,
          };
      }
      
    case "tool-generateBassTool":
      if (!part.tool_state) {
        throw new Error("songSearch_state is undefined");
      }
      switch (part.tool_state) {
        case "input-streaming":
          return {
            type: "tool-generateBassTool",
            state: "input-streaming",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateBassTool_input!,
          };
        case "input-available":
          return {
            type: "tool-generateBassTool",
            state: "input-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateBassTool_input!,
          };
        case "output-available":
          return {
            type: "tool-generateBassTool",
            state: "output-available",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateBassTool_input!,
            output: part.tool_generateBassTool_output!,
          };
        case "output-error":
          return {
            type: "tool-generateBassTool",
            state: "output-error",
            toolCallId: part.tool_toolCallId!,
            input: part.tool_generateBassTool_input!,
            errorText: part.tool_errorText!,
          };
      }

    // case "data-weather":
    //   return {
    //     type: "data-weather",
    //     data: {
    //       loading: false,
    //       location: part.data_weather_location!,
    //       weather: part.data_weather_weather!,
    //       temperature: part.data_weather_temperature!,
    //     },
    //     id: part.data_weather_id!,
    //   };
    default:
      throw new Error(`Unsupported part type: ${part.type}`);
  }
};
