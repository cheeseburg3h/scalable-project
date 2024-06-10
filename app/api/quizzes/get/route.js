import { connectMongoDB } from '@/lib/mongodb';
import Quiz from '@/models/quiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await connectMongoDB();

    const quizzes = await Quiz.find({ createdBy: session.user.email }).select('title');

    return new NextResponse(JSON.stringify({ quizzes }), { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
