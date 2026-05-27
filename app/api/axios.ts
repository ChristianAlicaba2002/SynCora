import axios from "axios";

const base_url = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type" : "application/json"
    }
});
