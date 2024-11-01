import { useEffect } from "react";
import "../styles/demonstrate.scss";

export default function Result(props: { result: any; index: number }) {
  const getColor = (score: number) => {
    if (score < 0.1) return `#eeeeee`;
    return `rgba(255, 0, 0, ${score})`;
  };

  useEffect(() => {
    const words = document.querySelectorAll(`.word`);
    let index = 0;

    function highlightWord() {
      words.forEach((word) => {
        word.style.backgroundColor = "";
        word.querySelector(".score").classList.remove("show-score");
      });

      words[index].style.backgroundColor = getColor(props.result[index].score);
      words[index].querySelector(".score").classList.add("show-score");

      index = (index + 1) % words.length;
    }

    setInterval(highlightWord, 1000);
  }, []);

  return (
    <div>
      <div className="containerr">
        {props.result.map((item, index) => {
          return (
            <div className={`word`} key={index}>
              {item.message}
              <div
                className="score"
                style={{
                  position: "absolute",
                  bottom: -40,
                  left: 80,
                  fontSize: 20,
                }}
              >
                <span style={{ width: "200px" }}>{item.message}</span>
                为大模型幻觉的可能性：{item.score.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
