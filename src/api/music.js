/** @format */

import axios from "../config/axios";

export const recommend_chords = async data => await axios.post("/music/recommend-chords", data);

export const get_all_by_type = async type => await axios.get(`/music/get-all-by-type?type=${type}`);

export const change_chords = async data => await axios.post("/music/change-chords", data);

export const generate_settings = async data => await axios.post("/music/analyze_synth_settings", data);

export const save_arp_settings = async data => await axios.post("/music/save_arp_settings", data);

export const getMusicStyle = async () => await axios.get("/music/getMusicStyle");

export const getMyTimble = async () => await axios.get("/music/getMyTimble");

export const deleteMyTimble = async (id) => await axios.delete(`/music/${id}`);

export const getTranding = async () => await axios.get("/music/getTranding");



export const search = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) query.append(k, v);
  });
  return await axios.get(`/music/search_music?${query.toString()}`);
};






