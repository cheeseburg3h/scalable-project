"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customId, setCustomId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleCustomIdChange = (e) => {
    setCustomId(e.target.value);
  };

  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customId || !quizTitle || questions.some(q => !q.question || q.options.some(o => !o) || !q.correctAnswer)) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customId, title: quizTitle, questions }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Quiz created successfully");
      setError("");
      setCustomId("");
      setQuizTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (error) {
      setError(error.message);
      setMessage("");
    }
  };

  const handleBackToProfile = () => {
    router.push("/profile-page");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to create a quiz</div>;
  }

  return (
    <div className="min-h-screen bg-purple-200 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold mb-8 text-black">Create or Edit Quiz</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
        {message && <div className="bg-green-500 text-white p-2 rounded mb-4">{message}</div>}
        <div className="mb-6">
          <label htmlFor="customId" className="block text-xl font-semibold mb-2">
            Custom ID
          </label>
          <input
            id="customId"
            type="text"
            value={customId}
            onChange={handleCustomIdChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="quizTitle" className="block text-xl font-semibold mb-2">
            Quiz Title
          </label>
          <input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={handleQuizTitleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <label className="block text-xl font-semibold mb-2">
              Question {questionIndex + 1}
            </label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              required
            />
            {q.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <label className="block text-lg mb-1">
                  Option {String.fromCharCode(65 + optionIndex)}
                </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            ))}
            <label className="block text-lg mb-2">
              Correct Answer
            </label>
            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(questionIndex, e)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveQuestion(questionIndex)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-6"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Save Quiz
        </button>
        <button
          type="button"
          onClick={handleBackToProfile}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-4"
        >
          Back to Profile
        </button>
      </form>
    </div>
  );
}