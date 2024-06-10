import mongoose, { Schema, models } from "mongoose";

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    createdBy: {
      type: String, // Changed to String to store email
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
