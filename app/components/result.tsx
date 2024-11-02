import { useEffect } from "react";
import "../styles/demonstrate.scss";
import Image from "next/image";

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
      document.querySelectorAll(`.detectWord`)[index].style.backgroundColor =
        getColor(props.result[index].score);
      words[index].querySelector(".score").classList.add("show-score");
      index = (index + 1) % words.length;
    }

    setInterval(highlightWord, 1000);
  }, []);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: 15,
          padding: 2,
        }}
      >
        <Image src="/chatgpt.svg" width={50} height={50} />
      </div>
      <div className="containerr">
        {props.result.map((item, index) => {
          return (
            <div className={`word`} key={index}>
              {item.message}
              <div
                className="score"
                style={{
                  position: "absolute",
                  bottom: -80,
                  left: 400,
                  fontSize: 20,
                  display: "flex",
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignContent: "center",
                  paddingRight: 30,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div
                  className="detectWord"
                  style={{
                    width: "120px",
                    textAlign: "center",
                    lineHeight: 2,
                    margin: "0 5px",
                  }}
                >
                  {item.message}
                </div>
                <div style={{ lineHeight: 2 }}>
                  为大模型幻觉的可能性：{item.score.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          zIndex: -2,
          position: "absolute",
          right: -65,
          bottom: -85,
          backgroundColor: "white",
          borderRadius: 15,
          padding: 5,
        }}
      >
        <Image src="/seu.png" width={50} height={50} />
      </div>
    </div>
  );
}
