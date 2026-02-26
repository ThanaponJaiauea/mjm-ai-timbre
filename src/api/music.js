/** @format */

import axios from "../config/axios";

export const recommend_chords = async data => await axios.post("/music/recommend-chords", data);

export const get_all_by_type = async type => await axios.get(`/music/get-all-by-type?type=${type}`);

export const change_chords = async data => await axios.post("/music/change-chords", data);
