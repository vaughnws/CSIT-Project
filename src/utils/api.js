import { useAuth } from '../contexts/AuthContext';

// Enhanced API Integration Function for OpenRouter with user tracking
export const callOpenRouter = async (
  prompt,
  model = "openai/gpt-oss-20b:free@preset/rrc-eduai",
  userId = null,
  toolName = null
) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "RRC EduAI Platform",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", response.status, errorText);

      // Handle specific error codes
      if (response.status === 404) {
        throw new Error(
          "API endpoint not found. Please check the OpenRouter configuration."
        );
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please check your API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Invalid response format from API");
    }

    const responseContent = data.choices[0].message.content;

    // Log usage if user and tool info provided
    if (userId && toolName) {
      try {
        await fetch('/api/user/log-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            toolUsed: toolName,
            sessionData: {
              prompt_length: prompt.length,
              response_length: responseContent.length,
              model_used: model,
              timestamp: new Date().toISOString()
            }
          }),
        });
      } catch (logError) {
        console.warn('Failed to log usage:', logError);
        // Don't throw error for logging failures
      }
    }

    return responseContent;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);

    // Return user-friendly error messages
    if (error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    } else if (error.message.includes("404")) {
      throw new Error(
        "API service temporarily unavailable. Please try again later."
      );
    } else if (error.message.includes("401")) {
      throw new Error(
        "Authentication error. Please refresh the page and try again."
      );
    } else {
      throw new Error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  }
};

// Hook for authenticated API calls
export const useAuthenticatedAPI = () => {
  const { user, logToolUsage } = useAuth();

  const callOpenRouterWithAuth = async (prompt, toolName, model = "openai/gpt-oss-20b:free@preset/rrc-eduai") => {
    const response = await callOpenRouter(prompt, model, user?.id, toolName);
    
    // Also log through auth context for immediate UI updates
    if (user && toolName) {
      await logToolUsage(toolName, {
        prompt_length: prompt.length,
        response_length: response.length,
        model_used: model
      });
    }
    
    return response;
  };

  return { callOpenRouterWithAuth };
};

// Alternative API call function with different model options
export const callOpenRouterWithModel = async (prompt, modelOption = "gpt3", userId = null, toolName = null) => {
  const modelMap = {
    gpt3: "openai/gpt-3.5-turbo",
    gpt4: "openai/gpt-4-turbo",
    claude: "anthropic/claude-3-haiku",
    free: "openai/gpt-3.5-turbo",
    mistral: "mistralai/mistral-7b-instruct",
  };

  const model = modelMap[modelOption] || modelMap["gpt3"];
  return await callOpenRouter(prompt, model, userId, toolName);
};

// Test API connection function
export const testAPIConnection = async () => {
  try {
    const response = await callOpenRouter(
      "Hello, please respond with 'API connection successful'"
    );
    return (
      response.includes("successful") ||
      response.includes("API") ||
      response.length > 0
    );
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};

// Enhanced utility function to download text as file with user tracking
export const downloadTextFile = async (content, filename, userId = null, toolName = null) => {
  try {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Log download action
    if (userId && toolName) {
      try {
        await fetch('/api/user/log-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            toolUsed: `${toolName}_download`,
            sessionData: {
              action: 'download',
              filename: filename,
              content_length: content.length,
              timestamp: new Date().toISOString()
            }
          }),
        });
      } catch (logError) {
        console.warn('Failed to log download:', logError);
      }
    }

  } catch (error) {
    console.error("Error downloading file:", error);
    alert(
      "Sorry, there was an error downloading the file. Please copy the text manually."
    );
  }
};

// Enhanced utility function to copy text to clipboard with user tracking
export const copyToClipboard = async (text, userId = null, toolName = null) => {
  try {
    let success = false;
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      success = true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      success = document.execCommand("copy");
      textArea.remove();
    }

    // Log copy action
    if (success && userId && toolName) {
      try {
        await fetch('/api/user/log-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            toolUsed: `${toolName}_copy`,
            sessionData: {
              action: 'copy',
              content_length: text.length,
              timestamp: new Date().toISOString()
            }
          }),
        });
      } catch (logError) {
        console.warn('Failed to log copy action:', logError);
      }
    }

    return success;
  } catch (error) {
    console.error("Failed to copy text: ", error);
    // Show fallback message to user
    prompt("Copy this text manually:\n\n" + text);
    return false;
  }
};

// User progress functions
export const markTutorialComplete = async (userId, tutorialId) => {
  try {
    const response = await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        tutorialId: tutorialId,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to mark tutorial complete');
    }
  } catch (error) {
    console.error('Error marking tutorial complete:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`/api/user/stats?userId=${userId}`);
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch user stats');
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Export all functions
export default {
  callOpenRouter,
  useAuthenticatedAPI,
  callOpenRouterWithModel,
  testAPIConnection,
  downloadTextFile,
  copyToClipboard,
  markTutorialComplete,
  getUserStats
};