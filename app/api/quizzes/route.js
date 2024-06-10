import { connectMongoDB } from '@/lib/mongodb';
import Quiz from '@/models/quiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('POST request received'); // Log request received

  try {
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      console.error('Unauthorized access attempt');
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return new NextResponse(JSON.stringify({ message: 'Invalid JSON' }), { status: 400 });
    }

    const { title, questions } = body;

    if (!title || !questions) {
      console.error('Missing title or questions in request body');
      return new NextResponse(JSON.stringify({ message: 'Bad Request: Missing title or questions' }), { status: 400 });
    }

    console.log('Parsed Body:', { title, questions });

    await connectMongoDB();
    console.log('MongoDB connected');

    const quiz = new Quiz({
      title,
      questions,
      createdBy: session.user.email,
    });

    await quiz.save();
    console.log('Quiz saved');

    return new NextResponse(JSON.stringify({ message: 'Quiz created successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return new NextResponse(JSON.stringify({ message: `Internal server error: ${error.message}` }), { status: 500 });
  }
}
