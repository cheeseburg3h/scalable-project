import { connectMongoDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getSession } from "next-auth/react";

export async function POST(req) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const { title, questions } = await req.json();

    await connectMongoDB();

    const quiz = new Quiz({
      title,
      questions,
      createdBy: session.user.email, // Using email instead of id
    });

    await quiz.save();
    return new Response(JSON.stringify({ message: "Quiz created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
