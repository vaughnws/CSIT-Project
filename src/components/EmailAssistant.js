import React, { useState } from "react";
import { Mail, Loader, Copy, RefreshCw } from "lucide-react";
import { callOpenRouter, copyToClipboard } from "../utils/api";
import MarkdownRenderer from "./MarkdownRenderer";

const EmailAssistant = () => {
  const [emailContext, setEmailContext] = useState("");
  const [emailType, setEmailType] = useState("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const prompt = `You are an email writing assistant. Generate a ${emailType} email based on this context: ${emailContext}. 
      
      Please format the email properly with:
      - Subject line
      - Appropriate greeting
      - Clear, well-structured body
      - Professional closing
      
      Make it ${
        emailType === "academic"
          ? "suitable for academic communication"
          : emailType === "formal"
          ? "very formal and professional"
          : "professional but friendly"
      }.`;

      const response = await callOpenRouter(prompt);
      setGeneratedEmail(response);
    } catch (error) {
      setGeneratedEmail(
        "Sorry, there was an error generating your email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Smart Email Assistant
        </h2>
        <p className="text-gray-600">
          Generate professional emails with AI assistance
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="academic">Academic</option>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Context/Purpose
            </label>
            <textarea
              value={emailContext}
              onChange={(e) => setEmailContext(e.target.value)}
              placeholder="Describe what you need the email for (e.g., requesting a meeting with professor, following up on assignment feedback, etc.)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
            />
          </div>

          <button
            onClick={generateEmail}
            disabled={!emailContext.trim() || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {generatedEmail && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Email
            </h3>
            <button
              onClick={() => copyToClipboard(generatedEmail)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <MarkdownRenderer content={generatedEmail} />
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={generateEmail}
              disabled={loading}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Regenerate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAssistant;
