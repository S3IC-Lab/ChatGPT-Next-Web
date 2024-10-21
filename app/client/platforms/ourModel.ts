"use client";
import { ByteDance } from "@/app/constant";

import { ChatOptions, LLMApi, LLMModel, SpeechOptions } from "../api";
import axios from "axios";

export interface OpenAIListModelResponse {
  object: string;
  data: Array<{
    id: string;
    object: string;
    root: string;
  }>;
}

// pending
interface RequestPayload {
  prompt: string;
  model_type: "Llama-13B" | "Alpaca-13B" | "Vicuna-13B" | "Llama2-13B";
}

export class OurModelApi implements LLMApi {
  path(): string {
    return "http://localhost:8000/v1";
  }

  extractMessage(res: any) {
    // pending
    return "test";
  }

  speech(options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }

  async chat(options: ChatOptions) {
    console.log(options.messages);

    axios
      .post(`${this.path}/completions`, {
        prompt: options.messages[options.messages.length - 1].content,
        model_type: options.config.model,
      })
      .then((res) => {
        options.onFinish(this.extractMessage(res));
      });

    // test
    // axios.post("https://jsonplaceholder.typicode.com/posts", {
    //   "userId": 1,
    //   "id": 2,
    //   "title": "qj",
    //   "body": "sf"
    // }).then(res => {
    //   console.log(res);
    //   options.onFinish("test");
    // })
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
