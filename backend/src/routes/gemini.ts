import { Hono } from "hono";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const geminiRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GEMINI_API: string;
  };
  Variables: {
    userId: string;
  };
}>();

geminiRouter.post("/", async (c) => {
  const body = await c.req.json();
  const genAI = new GoogleGenerativeAI(c.env.GEMINI_API);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = body.prompt;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return c.json(text);
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error while processing` });
  }
});
