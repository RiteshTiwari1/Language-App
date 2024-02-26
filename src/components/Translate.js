import React, { useEffect, useState } from "react";
import countries from "../data";

const Translate = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("fr-FR");

  useEffect(() => {
    const selectTags = document.querySelectorAll("select");

    selectTags.forEach((tag, id) => {
      for (let country_code in countries) {
        const selected = (id === 0 && country_code === "en-GB") || (id === 1 && country_code === "fr-FR") ? "selected" : "";
        const option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });

    const exchangeIcon = document.querySelector(".exchange");
    exchangeIcon.addEventListener("click", handleExchange);

    const textAreaFrom = document.querySelector(".from-text");
    textAreaFrom.addEventListener("keyup", handleKeyUp);

    const translateBtn = document.querySelector("button");
    translateBtn.addEventListener("click", handleTranslate);

    const icons = document.querySelectorAll(".row i");
    icons.forEach((icon) => {
      icon.addEventListener("click", handleIconClick);
    });

    return () => {
      exchangeIcon.removeEventListener("click", handleExchange);
      textAreaFrom.removeEventListener("keyup", handleKeyUp);
      translateBtn.removeEventListener("click", handleTranslate);
      icons.forEach((icon) => {
        icon.removeEventListener("click", handleIconClick);
      });
    };
  }, [fromLang, toLang]);

  const handleExchange = () => {
    setFromText((prevFromText) => {
      setToText(prevFromText);
      return toText;
    });

    setFromLang((prevFromLang) => {
      setToLang(prevFromLang);
      return toLang;
    });
  };

  const handleKeyUp = () => {
    if (!fromText) {
      setToText("");
    }
  };

  const handleTranslate = async () => {
    if (!fromText) return;

    setToText("Translating...");

    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLang}|${toLang}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      const translation = data.matches.length > 0 ? data.matches[0].translation : "";
      setToText(translation);
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleIconClick = ({ target }) => {
    if (!fromText || !toText) return;

    if (target.classList.contains("fa-copy")) {
      const copyText = target.id === "from" ? fromText : toText;
      navigator.clipboard.writeText(copyText);
    } else {
      const utterance = new SpeechSynthesisUtterance(target.id === "from" ? fromText : toText);
      utterance.lang = target.id === "from" ? fromLang : toLang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter text"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          ></textarea>
          <textarea
            spellCheck="false"
            readOnly
            disabled
            className="to-text"
            placeholder="Translation"
            value={toText}
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i id="from" className="fas fa-volume-up" onClick={handleIconClick}></i>
              <i id="from" className="fas fa-copy" onClick={handleIconClick}></i>
            </div>
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}></select>
          </li>
          <li className="exchange" onClick={handleExchange}>
            <i className="fas fa-exchange-alt"></i>
          </li>
          <li className="row to">
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}></select>
            <div className="icons">
              <i id="to" className="fas fa-volume-up" onClick={handleIconClick}></i>
              <i id="to" className="fas fa-copy" onClick={handleIconClick}></i>
            </div>
          </li>
        </ul>
      </div>
      <button onClick={handleTranslate}>Translate Text</button>
    </div>
  );
};

export default Translate;
