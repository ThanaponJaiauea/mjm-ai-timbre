/** @format */

import axios from "../config/axios";

export const createPayment = async formData => await axios.post("/payments/", formData);

export const getPaymentByUserId = async () => await axios.get("/payments/");

export const getSubscription = async () => await axios.get("/payments/getSubscription");
