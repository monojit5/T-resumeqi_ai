import dotenv from 'dotenv';
dotenv.config();
import {ChatGoogle} from "@langchain/google/node";

export const model = new ChatGoogle({
  model:"gemini-2.5-flash",
  temperature: 0.3,
  apiKey:process.env.API_KEY
})