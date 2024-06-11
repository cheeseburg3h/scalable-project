// app/api/quizzes/[customId]/route.js

import { connectMongoDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";

export async function GET(req, { params }) {
  try {
    const { customId } = params;
    await connectMongoDB();
    const quiz = await Quiz.findOne({ customId });

    if (!quiz) {
      return new Response(JSON.stringify({ message: "Quiz not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(quiz), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
