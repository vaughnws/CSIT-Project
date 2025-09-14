import React, { useState } from "react";
import { Mail, Loader, Copy, RefreshCw } from "lucide-react";
import { callOpenRouter, copyToClipboard } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import MarkdownRenderer from "./MarkdownRenderer";

const EmailAssistant = () => {
  const { user, logToolUsage } = useAuth();
  const [emailContext, setEmailContext] = useState("");
  const [emailType, setEmailType] = useState("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    if (!emailContext.trim()) {
      showNotification('❌ Please provide email context', 'error');
      return;
    }

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

      const response = await callOpenRouter(
        prompt, 
        "openai/gpt-3.5-turbo",
        user?.id,
        "email-assistant"
      );
      
      setGeneratedEmail(response);

      // Log successful usage
      if (user) {
        await logToolUsage("email-assistant", {
          action: "generate_email",
          email_type: emailType,
          context_length: emailContext.length,
          response_length: response.length,
          timestamp: new Date().toISOString()
        });
      }

      showNotification('✅ Email generated successfully!', 'success');
    } catch (error) {
      console.error('Email generation error:', error);
      setGeneratedEmail(
        "Sorry, there was an error generating your email. Please try again."
      );
      showNotification('❌ Failed to generate email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedEmail, user?.id, "email-assistant");
    if (success && user) {
      await logToolUsage("email-assistant", {
        action: "copy_email",
        timestamp: new Date().toISOString()
      });
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                   type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
                   'bg-blue-100 border-blue-400 text-blue-700';
    
    notification.className = `fixed top-4 right-4 ${bgColor} px-4 py-3 rounded border z-50 max-w-sm`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
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
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
              disabled={loading}
              placeholder="Describe what you need the email for (e.g., requesting a meeting with professor, following up on assignment feedback, etc.)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none disabled:opacity-50"
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
              onClick={handleCopy}
              disabled={loading}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
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
              disabled={loading || !emailContext.trim()}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Regenerate</span>
            </button>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Be specific about the purpose and recipient of your email</li>
          <li>• Include any important details like deadlines or meeting preferences</li>
          <li>• Mention the tone you want (formal, casual, urgent, etc.)</li>
          <li>• Review and personalize the generated email before sending</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailAssistant;