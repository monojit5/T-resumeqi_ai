const DEFAULT_API_URL = "https://t-resumeqi-ai.onrender.com";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : DEFAULT_API_URL)
).replace(/\/+$/, "");

export default API_URL;
