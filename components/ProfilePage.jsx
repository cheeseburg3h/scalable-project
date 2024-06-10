"use client";

import { useState, useEffect } from "react";
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
      const res = await fetch("/api/quizzes/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await res.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

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
              <div className="bg-gray-400 text-white py-2 px-4 rounded mt-2">
                {quizzes.length > 0 ? quizzes[0].title : "No current quiz"}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recent Quizzes</h3>
              {quizzes.slice(1).map((quiz, index) => (
                <div key={index} className="bg-gray-400 text-white py-2 px-4 rounded mt-2">
                  {quiz.title}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-300 p-4 rounded shadow-md col-span-2">
            <h3 className="text-lg font-semibold text-center">All time score</h3>
            <div className="my-4">
              <div className="flex justify-between">
                <span>Addition 1</span>
                <a href="#" className="text-blue-500">Review</a>
              </div>
              <div className="bg-gray-400 h-6 rounded-full overflow-hidden mt-1">
                <div className="bg-green-500 h-full" style={{ width: '80%' }}></div>
                <div className="bg-red-500 h-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="my-4">
              <div className="flex justify-between">
                <span>Addition 2</span>
                <a href="#" className="text-blue-500">Review</a>
              </div>
              <div className="bg-gray-400 h-6 rounded-full overflow-hidden mt-1">
                <div className="bg-green-500 h-full" style={{ width: '70%' }}></div>
                <div className="bg-red-500 h-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="my-4">
              <div className="flex justify-between">
                <span>Addition 3</span>
                <a href="#" className="text-blue-500">Review</a>
              </div>
              <div className="bg-gray-400 h-6 rounded-full overflow-hidden mt-1">
                <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                <div className="bg-red-500 h-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-purple-300 p-4 rounded shadow-md col-span-3">
            <h3 className="text-lg font-semibold text-center">Upcoming Quizzes</h3>
            <div className="h-64 bg-gray-200 rounded mt-2 overflow-auto">
              {quizzes.length > 0 ? (
                quizzes.map((quiz, index) => (
                  <div key={index} className="bg-gray-400 text-white py-2 px-4 rounded mt-2">
                    {quiz.title}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No upcoming quizzes</div>
              )}
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
