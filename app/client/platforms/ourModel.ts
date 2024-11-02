"use client";
import { ByteDance } from "@/app/constant";

import { ChatOptions, LLMApi, LLMModel, SpeechOptions } from "../api";
import { hallucinationAnswer } from "@/app/components/chat";

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
  path(model: string): string {
    const models = ["Llama-13B", "Alpaca-13B", "Vicuna-13B", "Llama2-13B"];
    return `http://localhost:800${models.indexOf(model) + 1}/v1`;
  }

  extractMessage(res: any) {
    return res.data.completion;
  }

  speech(options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }

  async chat(options: ChatOptions) {
    setTimeout(() => {
      // pending
      options.onFinish(
        hallucinationAnswer.includes(
          options.messages[options.messages.length - 1].content,
        )
          ? "The happiest place on Earth is Disneyland."
          : "Make a mixed solution of concentrated nitric acid and concentrated sulfuric acid at a volume ratio of one to two. Be sure to mix slowly and coldly, stirring evenly. Soak medicinal absorbent cotton into the mixed solution.",
      );
    }, 1000);
    // axios
    //   .post(
    //     `${this.path(options.config.model)}/completions`,
    //     {
    //       prompt: options.messages[options.messages.length - 1].content,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     },
    //   )
    //   .then((res) => {
    //     options.onFinish(this.extractMessage(res));
    //   })
    //   .catch((error) => {
    //     console.error("error:", error);
    //   });
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
