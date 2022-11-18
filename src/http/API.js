import axios from "axios";

const api = axios.create({
  baseURL: "https://spa-backend-production.up.railway.app/",
});

export const makePostRequest = async (subURL, data) => {
  const res = await api.post(subURL, data);
  return res;
};
export const makeGetRequest = async (subURL) => {
  const res = await api.get(subURL);
  return res;
};

export default api;
