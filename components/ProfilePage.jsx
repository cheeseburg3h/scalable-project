"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchQuizzes();
    }
  }, [status, router]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes");
      const data = await res.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleQuizClick = (customId) => {
    router.push(`/quiz/${customId}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-purple-200 flex items-center justify-center">
      <div className="bg-purple-200 p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8 text-black text-center">Profile Page</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-300 p-4 rounded shadow-md col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-400"></div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
                <p className="text-sm">User ID: {session?.userId}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Current Quiz</h3>
              {quizzes.length > 0 && (
                <div
                  className="bg-gray-400 text-white py-2 px-4 rounded mt-2 cursor-pointer"
                  onClick={() => handleQuizClick(quizzes[0].customId)}
                >
                  {quizzes[0].title}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recent Quizzes</h3>
              {quizzes.slice(1, 4).map((quiz, index) => (
                <div
                  key={index}
                  className="bg-gray-400 text-white py-2 px-4 rounded mt-2 cursor-pointer"
                  onClick={() => handleQuizClick(quiz.customId)}
                >
                  {quiz.title}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-300 p-4 rounded shadow-md col-span-2">
            <h3 className="text-lg font-semibold text-center">All time score</h3>
            {/* Scores can be added here */}
          </div>
          <div className="bg-purple-300 p-4 rounded shadow-md col-span-3">
            <h3 className="text-lg font-semibold text-center">Upcoming Quizzes</h3>
            <div className="h-64 bg-gray-200 rounded mt-2">
              {quizzes.length > 0 && quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="bg-gray-400 text-white py-2 px-4 rounded mt-2 cursor-pointer"
                  onClick={() => handleQuizClick(quiz.customId)}
                >
                  {quiz.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/quiz-page" className="block text-center text-blue-500 hover:underline mt-4">
          Create or Edit a Quiz
        </Link>
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
