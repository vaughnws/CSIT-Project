import React, { useState } from "react";
import { FileText, Loader, Copy, Download } from "lucide-react";
import {
  callOpenRouter,
  copyToClipboard,
  downloadTextFile,
} from "../utils/api";
import MarkdownRenderer from "./MarkdownRenderer";

const NoteSummarizer = () => {
  const [notes, setNotes] = useState("");
  const [summaryLength, setSummaryLength] = useState("detailed");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarizeNotes = async () => {
    setLoading(true);
    try {
      const lengthInstructions = {
        brief: "Provide a very brief summary in 3-5 bullet points",
        detailed:
          "Provide a detailed summary with key concepts and important details",
        comprehensive:
          "Provide a comprehensive summary with all important information organized by topics",
      };

      const prompt = `You are a lecture note summarizer. ${lengthInstructions[summaryLength]} of the following lecture content:

${notes}

Please format the summary clearly with:
- Main topics/concepts
- Key points under each topic
- Important details to remember
- Any action items or assignments mentioned`;

      const response = await callOpenRouter(prompt);
      setSummary(response);
    } catch (error) {
      setSummary(
        "Sorry, there was an error summarizing your notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lecture Notes Summarizer
        </h2>
        <p className="text-gray-600">
          Extract key points and organize your lecture content
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary Length
            </label>
            <select
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="brief">Brief (3-5 key points)</option>
              <option value="detailed">
                Detailed (comprehensive overview)
              </option>
              <option value="comprehensive">
                Comprehensive (full breakdown)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Notes/Content
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your lecture notes, reading materials, or any content you'd like summarized..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-none"
            />
          </div>

          <button
            onClick={summarizeNotes}
            disabled={!notes.trim() || loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                <span>Summarize Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {summary && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(summary)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span className="text-sm">Copy</span>
              </button>
              <button
                onClick={() => downloadTextFile(summary, "lecture-summary.txt")}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <MarkdownRenderer content={summary} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteSummarizer;
