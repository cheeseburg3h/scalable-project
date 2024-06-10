import { connectMongoDB } from "@/lib/mongodb";
import Quiz from "@/models/quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    // Adding getHeader and setHeader methods to NextResponse for compatibility
    res.getHeader = (name) => res.headers.get(name);
    res.setHeader = (name, value) => res.headers.set(name, value);

    const session = await getServerSession(req, res, authOptions);
    console.log("Session:", session); // Debugging log

    if (!session) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, questions } = body;
    console.log("Request Body:", body);

    if (!title || !questions) {
      console.error("Missing title or questions in request body");
      return NextResponse.json({ message: "Bad Request: Missing title or questions" }, { status: 400 });
    }

    console.log("Title:", title);
    console.log("Questions:", questions);

    await connectMongoDB();
    console.log("MongoDB connected");

    const quiz = new Quiz({
      title,
      questions,
      createdBy: session.user.email, // Using email instead of id
    });

    await quiz.save();
    console.log("Quiz saved");

    return NextResponse.json({ message: "Quiz created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
