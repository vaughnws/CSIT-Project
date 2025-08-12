import React, { useState } from "react";
import { Brain, Loader, Copy, Download } from "lucide-react";
import {
  callOpenRouter,
  copyToClipboard,
  downloadTextFile,
} from "../utils/api";
import MarkdownRenderer from "./MarkdownRenderer";

const QuizGenerator = () => {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [questionCount, setQuestionCount] = useState("5");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const prompt = `You are a quiz generator for educational purposes. Create ${questionCount} ${questionType} questions about ${subject} at ${difficulty} level.

Format requirements:
- For multiple choice: Include question, 4 options (A, B, C, D), and mark the correct answer
- For short answer: Include question and a brief model answer
- For essay: Include question and key points that should be addressed

Make sure questions are:
- Appropriate for ${difficulty} level
- Educational and thought-provoking
- Cover different aspects of the topic
- Include clear instructions

Topic: ${subject}
Difficulty: ${difficulty}
Question Type: ${questionType}
Number of Questions: ${questionCount}`;

      const response = await callOpenRouter(prompt);
      setQuiz(response);
    } catch (error) {
      setQuiz(
        "Sorry, there was an error generating your quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz & Assignment Generator
        </h2>
        <p className="text-gray-600">
          Create customized quizzes and assignments with AI
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject/Topic
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Calculus, World History, Biology..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
              <option value="essay">Essay Questions</option>
              <option value="mixed">Mixed Types</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateQuiz}
          disabled={!subject.trim() || loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      </div>

      {quiz && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Quiz
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(quiz)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span className="text-sm">Copy</span>
              </button>
              <button
                onClick={() => downloadTextFile(quiz, `${subject}-quiz.txt`)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <MarkdownRenderer content={quiz} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
