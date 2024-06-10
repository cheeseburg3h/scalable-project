import { connectMongoDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { customId } = params;

  try {
    await connectMongoDB();
    const quiz = await Quiz.findOne({ customId });

    if (!quiz) {
      return new NextResponse(JSON.stringify({ message: "Quiz not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ quiz }), { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return new NextResponse(JSON.stringify({ message: `Internal server error: ${error.message}` }), { status: 500 });
  }
}
