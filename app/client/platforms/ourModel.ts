"use client";
import { ByteDance } from "@/app/constant";

import {
  ChatOptions,
  LLMApi,
  LLMModel,
  MultimodalContent,
  SpeechOptions,
} from "../api";

export interface OpenAIListModelResponse {
  object: string;
  data: Array<{
    id: string;
    object: string;
    root: string;
  }>;
}

interface RequestPayload {
  messages: {
    role: "system" | "user" | "assistant";
    content: string | MultimodalContent[];
  }[];
  stream?: boolean;
  model: string;
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
  top_p: number;
  max_tokens?: number;
}

export class OurModelApi implements LLMApi {
  path(path: string): string {
    // pending
    return "http://localhost:8888";
  }

  extractMessage(res: any) {
    // pending
    return res;
  }

  speech(options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }

  // pending
  async chat(options: ChatOptions) {
    const fixedResponse = "Method not implemented.";
    options.onFinish(fixedResponse);
  }
  async usage() {
    return {
      used: 0,
      total: 0,
    };
  }

  async models(): Promise<LLMModel[]> {
    return [];
  }
}
export { ByteDance };
