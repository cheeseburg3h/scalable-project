"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const [customId, setCustomId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const { customId } = router.query;
    setCustomId(customId);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (customId) {
      fetch(`/api/quizzes/${customId}`)
        .then((res) => res.json())
        .then((data) => {
          setQuiz(data.quiz);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
          setLoading(false);
        });
    }
  }, [customId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="min-h-screen bg-purple-200 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold mb-8 text-black">{quiz.title}</h1>
      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{q.question}</h2>
          {q.options.map((option, optionIndex) => (
            <div key={optionIndex} className="mb-2">
              <label>
                <input type="radio" name={`question-${index}`} value={option} className="mr-2" />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
