import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import axios from 'axios';

const SimpleChatbot = () => {
  const [responseMessage, setResponseMessage] = useState('');

  const handleUserInput = async (userInput) => {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/gemini/', {
        message: userInput
      });
      const botResponse = response.data.message; // Adjust according to your API response structure
      setResponseMessage(botResponse);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponseMessage('Sorry, something went wrong.');
    }
  };

  const steps = [
    {
      id: '1',
      message: 'Welcome to the Chatbot! How can I help you today?',
      trigger: 'userInput',
    },
    {
      id: 'userInput',
      user: true,
      trigger: 'fetchResponse',
    },
    {
      id: 'fetchResponse',
      component: <div>Fetching response...</div>,
      asMessage: true,
      trigger: 'showResponse',
    },
    {
      id: 'showResponse',
      message: () => responseMessage,
      end: true,
    },
  ];

  return (
    <ChatBot
      headerTitle="Simple Chatbot"
      steps={steps}
      handleEnd={() => setResponseMessage('')}
    />
  );
};

export default SimpleChatbot;
