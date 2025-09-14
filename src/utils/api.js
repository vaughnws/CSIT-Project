// Enhanced API Integration Function for OpenRouter with user tracking
export const callOpenRouter = async (
  prompt,
  model = "openai/gpt-3.5-turbo",
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
          "X-Title": "EduAI Platform",
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

    // Log usage to localStorage if user and tool info provided
    if (userId && toolName) {
      try {
        logToolUsageToLocalStorage(userId, toolName, {
          prompt_length: prompt.length,
          response_length: responseContent.length,
          model_used: model,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('Failed to log usage to localStorage:', logError);
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

// Helper function to log tool usage to localStorage
const logToolUsageToLocalStorage = (userId, toolName, sessionData) => {
  try {
    const sessionsKey = `user_sessions_${userId}`;
    const existingSessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    
    existingSessions.push({
      tool_used: toolName,
      session_data: sessionData,
      created_at: new Date().toISOString()
    });
    
    // Keep only last 50 sessions to prevent localStorage bloat
    if (existingSessions.length > 50) {
      existingSessions.splice(0, existingSessions.length - 50);
    }
    
    localStorage.setItem(sessionsKey, JSON.stringify(existingSessions));
  } catch (error) {
    console.warn('Failed to log to localStorage:', error);
  }
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
    URL.revokeObjectURL(element.href);

    // Log download action to localStorage
    if (userId && toolName) {
      try {
        logToolUsageToLocalStorage(userId, `${toolName}_download`, {
          action: 'download',
          filename: filename,
          content_length: content.length,
          timestamp: new Date().toISOString()
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

    // Log copy action to localStorage
    if (success && userId && toolName) {
      try {
        logToolUsageToLocalStorage(userId, `${toolName}_copy`, {
          action: 'copy',
          content_length: text.length,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('Failed to log copy action:', logError);
      }
    }

    // Show user feedback
    if (success) {
      showNotification('✅ Copied to clipboard!', 'success');
    }

    return success;
  } catch (error) {
    console.error("Failed to copy text: ", error);
    
    // Show fallback for manual copy
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    fallbackDiv.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Manual Copy</h3>
        <p class="text-sm text-gray-600 mb-4">Please copy this text manually:</p>
        <textarea class="w-full h-32 p-3 border rounded-lg text-sm" readonly>${text}</textarea>
        <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Close</button>
      </div>
    `;
    document.body.appendChild(fallbackDiv);
    
    // Select the text in the textarea
    const textarea = fallbackDiv.querySelector('textarea');
    textarea.focus();
    textarea.select();
    
    return false;
  }
};

// Utility function to show notifications
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

// User progress functions using localStorage
export const markTutorialComplete = async (userId, tutorialId) => {
  try {
    const progressKey = `user_progress_${userId}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    
    if (!existingProgress.includes(tutorialId)) {
      existingProgress.push(tutorialId);
      localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    }
    
    return { success: true, progress: existingProgress };
  } catch (error) {
    console.error('Error marking tutorial complete:', error);
    throw error;
  }
};

// Get user statistics from localStorage
export const getUserStats = async (userId) => {
  try {
    const progressKey = `user_progress_${userId}`;
    const sessionsKey = `user_sessions_${userId}`;
    
    const progress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    
    const toolsUsed = new Set(sessions.map(session => session.tool_used)).size;
    const recentSessions = sessions.slice(-5).reverse();
    
    return {
      tutorials_completed: progress.length,
      tools_used: toolsUsed,
      total_sessions: sessions.length,
      recent_sessions: recentSessions.map(session => ({
        tool_used: session.tool_used,
        created_at: session.created_at
      }))
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      tutorials_completed: 0,
      tools_used: 0,
      total_sessions: 0,
      recent_sessions: []
    };
  }
};

// Hook for components to use with user context
export const useAuthenticatedAPI = () => {
  // This would need to be imported from the auth context in the component
  // For now, just return the basic functions
  return {
    callOpenRouter,
    copyToClipboard,
    downloadTextFile,
    markTutorialComplete,
    getUserStats
  };
};

// Export all functions
export default {
  callOpenRouter,
  callOpenRouterWithModel,
  testAPIConnection,
  downloadTextFile,
  copyToClipboard,
  markTutorialComplete,
  getUserStats,
  useAuthenticatedAPI
};