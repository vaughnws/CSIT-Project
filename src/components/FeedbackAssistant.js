import React, { useState } from "react";
import { MessageSquare, Loader, Copy } from "lucide-react";
import { callOpenRouter, copyToClipboard } from "../utils/api";
import MarkdownRenderer from "./MarkdownRenderer";

const FeedbackAssistant = () => {
  const [document, setDocument] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    setLoading(true);
    try {
      const feedbackPrompts = {
        general:
          "Provide general constructive feedback on writing quality, clarity, and organization",
        academic:
          "Provide academic writing feedback focusing on argument structure, evidence, and scholarly tone",
        grammar:
          "Focus on grammar, spelling, punctuation, and language mechanics",
        structure: "Analyze document structure, flow, and logical organization",
      };

      const prompt = `You are a writing feedback assistant. ${feedbackPrompts[feedbackType]} for the following document:

"${document}"

Please provide:
1. **Strengths**: What works well in this writing
2. **Areas for Improvement**: Specific issues and suggestions
3. **Actionable Recommendations**: Concrete steps to improve
4. **Overall Assessment**: Summary of the document's effectiveness

Be constructive, specific, and encouraging in your feedback.`;

      const response = await callOpenRouter(prompt);
      setFeedback(response);
    } catch (error) {
      setFeedback(
        "Sorry, there was an error analyzing your document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Feedback & Peer Review Assistant
        </h2>
        <p className="text-gray-600">
          Get constructive feedback on your writing and work
        </p>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="prose text-gray-700">
            <p className="mb-4">
              Transform how you provide student feedback with AI assistance.
              This tool helps educators give more detailed, constructive, and
              personalized feedback while saving valuable time.
            </p>

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                What It Does:
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Analyzes student work:</strong> Reviews assignments,
                  essays, and projects
                </li>
                <li>
                  <strong>Generates constructive feedback:</strong> Provides
                  specific, actionable suggestions
                </li>
                <li>
                  <strong>Maintains your voice:</strong> Adapts to your teaching
                  style and preferences
                </li>
                <li>
                  <strong>Saves time:</strong> Reduces grading time while
                  improving feedback quality
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-orange-900 mb-2">
                How to Use:
              </h4>
              <ol className="space-y-2 text-sm">
                <li>
                  <strong>1. Upload or paste</strong> the student's work
                </li>
                <li>
                  <strong>2. Specify criteria</strong> (rubric, learning
                  objectives, etc.)
                </li>
                <li>
                  <strong>3. Set tone preference</strong> (encouraging,
                  detailed, brief)
                </li>
                <li>
                  <strong>4. Review and customize</strong> the AI-generated
                  feedback
                </li>
                <li>
                  <strong>5. Deliver to student</strong> with your personal
                  touch
                </li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Best Practices:
              </h4>
              <ul className="space-y-1 text-sm">
                <li>
                  • Always review AI feedback before sharing with students
                </li>
                <li>• Include specific examples from the student's work</li>
                <li>• Balance strengths with areas for improvement</li>
                <li>• Provide clear next steps for student growth</li>
                <li>
                  • Maintain academic integrity and institutional policies
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Remember:</strong> AI assists but doesn't replace your
              expertise. Use it to enhance your natural teaching abilities and
              provide more comprehensive feedback to help students succeed.
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type
            </label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Writing Feedback</option>
              <option value="academic">Academic Writing Review</option>
              <option value="grammar">Grammar & Language Check</option>
              <option value="structure">Structure & Organization</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document/Text for Review
            </label>
            <textarea
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Paste your document, essay, or text that you'd like feedback on..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-none"
            />
          </div>

          <button
            onClick={getFeedback}
            disabled={!document.trim() || loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing Document...</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5" />
                <span>Get Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Feedback Report
            </h3>
            <button
              onClick={() => copyToClipboard(feedback)}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <MarkdownRenderer content={feedback} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAssistant;
