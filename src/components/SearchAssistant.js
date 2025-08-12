import React, { useState } from "react";
import { Search, Loader, Copy } from "lucide-react";
import { callOpenRouter, copyToClipboard } from "../utils/api";
import MarkdownRenderer from "./MarkdownRenderer";

const SearchAssistant = () => {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [researchHelp, setResearchHelp] = useState("");
  const [loading, setLoading] = useState(false);

  const getResearchHelp = async () => {
    setLoading(true);
    try {
      const prompt = `You are a research assistant helping with academic research. Based on this query: "${query}" and context: "${context}", provide:

1. **Research Strategy**: Suggest specific databases, search terms, and research approaches
2. **Key Sources**: Recommend types of sources to look for (academic papers, books, reports, etc.)
3. **Search Keywords**: Provide alternative keywords and synonyms to use
4. **Citation Guidance**: Explain how to properly cite sources for this type of research
5. **Related Topics**: Suggest related areas that might be worth exploring

Make your suggestions practical and actionable for academic research.`;

      const response = await callOpenRouter(prompt);
      setResearchHelp(response);
    } catch (error) {
      setResearchHelp(
        "Sorry, there was an error getting research assistance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Content Search & Research Assistant
        </h2>
        <p className="text-gray-600">Get research guidance and citation help</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you researching? (e.g., 'climate change impacts on agriculture')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide context: What's this research for? What level of depth do you need? Any specific requirements?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
            />
          </div>

          <button
            onClick={getResearchHelp}
            disabled={!query.trim() || loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Getting Research Help...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Get Research Assistance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {researchHelp && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Research Guidance
            </h3>
            <button
              onClick={() => copyToClipboard(researchHelp)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <MarkdownRenderer content={researchHelp} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAssistant;
