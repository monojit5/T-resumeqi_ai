import { model } from "./ai.js";


export const testAi = async () => {
    try {
        const responce = await model.invoke(
            "Hello Gemini! Introduce yourself in one sentence."

        );
        console.log(responce.content)
    } catch (error) {
        console.log(error)
    }
};
