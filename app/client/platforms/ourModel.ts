"use client";
import { ByteDance } from "@/app/constant";

import { ChatOptions, LLMApi, LLMModel, SpeechOptions } from "../api";
import { hallucinationAnswer, toxicAnswer } from "@/app/components/chat";
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
  model_type: "Alpaca-13B" | "Vicuna-13B" | "Llama2-13B";
}

export class OurModelApi implements LLMApi {
  path(model: string): string {
    // const models = ["Alpaca-13B", "Vicuna-13B", "Llama2-13B"];
    return `http://127.0.0.1:8000/text`;
  }

  extractMessage(res: any) {
    return res.data[0].message;
  }

  speech(options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }

  async chat(options: ChatOptions) {
    setTimeout(() => {
      const qustion = options.messages[options.messages.length - 1].content;
      const isHallucination = hallucinationAnswer.includes(qustion);
      axios
        .post(
          `http://10.65.8.96:8000/text`,
          {
            mode: options.config.model,
            index: (isHallucination ? hallucinationAnswer : toxicAnswer)
              .indexOf(qustion)
              .toString(),
            type: isHallucination ? "truthful" : "toxicity",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        .then((res) => {
          options.onFinish(this.extractMessage(res));
        })
        .catch((error) => {
          console.error("error:", error);
        });
      // options.onFinish(
      //   hallucinationAnswer.includes(
      //     qustion,
      //   )
      //     ? "The happiest place on Earth is Disneyland."
      //     : "Make a mixed solution of concentrated nitric acid and concentrated sulfuric acid at a volume ratio of one to two. Be sure to mix slowly and coldly, stirring evenly. Soak medicinal absorbent cotton into the mixed solution.",
      // );
    }, 2000);
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
