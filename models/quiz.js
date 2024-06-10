import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  createdBy: { type: String, required: true },
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;
