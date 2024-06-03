import React, { useEffect, useState } from "react";
import { fetchQuote } from "../helper";

const Quote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const getQuote = async () => {
      const cachedQuote = sessionStorage.getItem("quote");
      if (!cachedQuote) {
        const newQuote = await fetchQuote();
        setQuote(newQuote);
        sessionStorage.setItem("quote", JSON.stringify(newQuote));
      } else {
        setQuote(JSON.parse(cachedQuote));
      }
    };

    getQuote();
  }, []);

  return (
    <div className="bg-gray-300 h-full flex flex-col justify-center items-center text-center p-5">
      {quote && (
        <>
          <span className="text-lg font-bold">"{quote.quote}"</span>
          <span className="text-md text-gray-600 mt-1">-{quote.author}</span>
        </>
      )}
    </div>
  );
};

export default Quote;
