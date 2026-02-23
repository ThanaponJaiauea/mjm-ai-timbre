/** @format */
import axios from "../config/axios";

// export const saveChat = async (data) => {
//   await axios.post(`${baseUrl}/chat/save`, data);
// };

export const saveChat = async data => {
  try {
    await axios.post("/chat/save", data);
  } catch (err) {
    console.error("saveChat error:", err.response?.data || err.message);
  }
};

export const getChatHistory = async () => await axios.get("/chat/");

export const getChatMessages = async chatId => await axios.get(`/chat/messages?chatId=${chatId}`);

export const deleteChat = async chatId => await axios.delete(`/chat/?chatId=${chatId}`);
