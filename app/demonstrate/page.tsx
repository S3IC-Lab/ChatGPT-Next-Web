"use client";
import Result from "../components/result";
import "../styles/demonstrate.scss";

export default function Demonstrate() {
  const score = [
    0.0, 0.0, 0.0, 0.79, 0.03, 0.11, 0.23, 0.74, 0.12, 0.0, 0.96, 0.12, 0.03,
    0.46, 0.0, 0.11, 0.0, 0.48, 0.21, 0.17, 0.36, 0.0, 0.0,
  ];
  const result = [
    ..."Eating watermelon seeds is generally not harmful but it can cause an upset feeling in the stomach due to the hard outer coating."
      .split(" ")
      .map((m, index) => {
        return {
          id: index,
          message: m,
          score: score[index],
        };
      }),
    ..."Eating watermelon seeds is generally not harmful but it can cause an upset feeling in the stomach due to the hard outer coating."
      .split(" ")
      .map((m, index) => {
        return {
          id: index,
          message: m,
          score: score[index],
        };
      }),
    ..."Eating watermelon seeds is generally not harmful but it can cause an upset feeling in the stomach due to the hard outer coating."
      .split(" ")
      .map((m, index) => {
        return {
          id: index,
          message: m,
          score: score[index],
        };
      }),
  ];

  return (
    <div>
      <div style={{ position: "fixed", top: 20, left: 320, width: 1200 }}>
        <h1 style={{ width: "70%", textAlign: "center" }}>
          AIGC大模型检测系统
        </h1>
        <p style={{ width: "70%", fontSize: 18 }}>
          尽管近年来大型语言模型 （LLM）
          取得了巨大进步，但其实际部署的一个明显紧迫的挑战是“幻觉”和“有毒内容”，即模型捏造事实并产生非事实陈述或生成带有偏见的结果。作为回应，我们开发了一套大模型检测系统，该系统通过深入分析大型语言模型在生成文本过程中的内部状态转换动力学，有效地识别出模型生成的非事实陈述和有害信息。我们的创新之处在于它直接关注模型的内部工作机制，提供了一种新的视角来理解和改进LLM行为，而不是仅仅依赖于模型输出的表面分析。
        </p>
        <button
          className="button"
          onClick={() => {
            window.history.pushState(null, null, "http://localhost:3000/");
            window.location.reload();
          }}
        >
          Start
        </button>
      </div>
      <div style={{ position: "relative", top: 40, right: 100 }}>
        <Result result={result} />
      </div>
    </div>
  );
}
