import React, { useState, useEffect } from "react";
import ChatBot from "react-chatbotify";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

  async function run(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "Oops! 🤖 BlogBuddy is currently unavailable. Please try again later.";
    }
  }

  const options = {
    notification: {
      disabled: true,
    },
    chatHistory: {
      disabled: true,
    },
    fileAttachment: {
      disabled: true,
    },
    header: {
      title: "BlogBuddy 🤖",
    },
    botBubble: {
      showAvatar: true,
    },
  };

  const flow = {
    start: {
      message:
        "🌟 Hey there, I'm BlogBuddy! Ready to craft some awesome blogs together? Let's get started! ✍️",
      path: "model_loop",
    },
    model_loop: {
      message: async (params) => {
        return await run(params.userInput, params.streamMessage);
      },
      path: "model_loop",
    },
  };

  return <ChatBot flow={flow} options={options} />;
};

export default Chatbot;
