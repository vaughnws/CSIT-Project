import React, { useState } from "react";
import { Lightbulb, Copy, CheckCircle } from "lucide-react";
import { copyToClipboard } from "../utils/api";

const PromptBuilder = () => {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [format, setFormat] = useState("");
  const [builtPrompt, setBuiltPrompt] = useState("");

  const buildPrompt = () => {
    let prompt = "";

    if (role) {
      prompt += `You are a ${role}. `;
    }

    if (task) {
      prompt += `${task} `;
    }

    if (context) {
      prompt += `Context: ${context} `;
    }

    if (format) {
      prompt += `Please format your response as: ${format}`;
    }

    setBuiltPrompt(prompt.trim());
  };

  const examplePrompts = [
    {
      title: "Academic Tutor",
      prompt:
        "You are an experienced academic tutor. Explain the concept of photosynthesis to a high school student. Use simple language and provide real-world examples. Format your response with clear headings and bullet points.",
    },
    {
      title: "Research Assistant",
      prompt:
        "You are a research assistant specializing in literature reviews. Help me identify key themes in environmental sustainability research from the past 5 years. Provide a structured summary with main categories and representative studies.",
    },
    {
      title: "Writing Coach",
      prompt:
        "You are a writing coach with expertise in academic writing. Review this thesis statement and provide specific suggestions for improvement. Focus on clarity, argumentation strength, and academic tone.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Prompt Builder
        </h2>
        <p className="text-gray-600">
          Learn to create effective AI prompts with our step-by-step builder
        </p>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How To Structure a Prompt
          </h3>
          <div className="prose text-gray-700">
            <p className="mb-4">
              A well-structured prompt helps AI tools understand exactly what
              you need. Follow this simple framework for better results:
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                The PACT Framework:
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Purpose:</strong> Clearly state what you want the AI
                  to do
                </li>
                <li>
                  <strong>Audience:</strong> Specify who the output is for
                </li>
                <li>
                  <strong>Context:</strong> Provide relevant background
                  information
                </li>
                <li>
                  <strong>Task:</strong> Define the specific action or format
                  needed
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Example Structure:
              </h4>
              <p className="text-sm font-mono bg-white p-3 rounded border">
                "You are a [ROLE]. I need you to [PURPOSE] for [AUDIENCE]. The
                context is [BACKGROUND INFO]. Please [SPECIFIC TASK] in
                [FORMAT]."
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Build Your Prompt
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Define the Role (YOU ARE A...)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., experienced teacher, research assistant, writing tutor"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Specify the Task
                </label>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g., Explain this concept, Help me understand, Create a summary of"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. Provide Context
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., This is for a college-level course, I'm struggling with the math concepts"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. Specify Format
                </label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="e.g., bullet points, step-by-step guide, detailed explanation"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={buildPrompt}
                className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Lightbulb className="h-5 w-5" />
                <span>Build Prompt</span>
              </button>
            </div>
          </div>

          {builtPrompt && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Built Prompt
                </h3>
                <button
                  onClick={() => copyToClipboard(builtPrompt)}
                  className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-800">{builtPrompt}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Best Practices
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Be Specific</p>
                  <p className="text-sm text-gray-600">
                    Clearly define what you want the AI to do
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Set Context</p>
                  <p className="text-sm text-gray-600">
                    Provide relevant background information
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Define Format</p>
                  <p className="text-sm text-gray-600">
                    Specify how you want the response structured
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Use Examples</p>
                  <p className="text-sm text-gray-600">
                    Show examples of desired output when possible
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Example Prompts
            </h3>
            <div className="space-y-4">
              {examplePrompts.map((example, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {example.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{example.prompt}</p>
                  <button
                    onClick={() => copyToClipboard(example.prompt)}
                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Copy Example
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;
