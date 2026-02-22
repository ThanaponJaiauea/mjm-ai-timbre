/** @format */

import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_CHAT_HISTORY_URL;
console.log("baseUrl", baseUrl);

// export const saveChat = async (data) => {
//   await axios.post(`${baseUrl}/chat/save`, data);
// };

export const saveChat = async data => {
  try {
    await axios.post(`${baseUrl}/chat/save`, data);
  } catch (err) {
    console.error("saveChat error:", err.response?.data || err.message);
  }
};

export const getChatHistory = async () => await axios.get(`${baseUrl}/chat/`);

export const getChatMessages = async chatId => await axios.get(`${baseUrl}/chat/messages?chatId=${chatId}`);

export const deleteChat = async chatId => await axios.delete(`${baseUrl}/chat/?chatId=${chatId}`);
