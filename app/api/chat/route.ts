import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  console.log(model);
  const result = await model.generateContent(message);

  return NextResponse.json({ reply: result.response.text() });
}
