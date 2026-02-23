/** @format */

import axios from "../config/axios";

export const recommend_chords = async data => await axios.post("/music/recommend-chords", data);
