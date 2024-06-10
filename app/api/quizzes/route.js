import { connectMongoDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, questions, customId } = await req.json();

    if (!title || !questions || !customId) {
      return NextResponse.json({ message: "Bad Request: Missing fields" }, { status: 400 });
    }

    await connectMongoDB();

    const quiz = new Quiz({
      customId,
      title,
      questions,
      createdBy: session.user.email,
    });

    await quiz.save();
    return NextResponse.json({ message: "Quiz created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
