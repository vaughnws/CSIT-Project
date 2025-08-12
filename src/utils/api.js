// API Integration Function for OpenRouter
export const callOpenRouter = async (
  prompt,
  model = "openai/gpt-oss-20b:free@preset/rrc-eduai"
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

    return data.choices[0].message.content;
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

// Alternative API call function with different model options
export const callOpenRouterWithModel = async (prompt, modelOption = "gpt3") => {
  const modelMap = {
    gpt3: "openai/gpt-3.5-turbo",
    gpt4: "openai/gpt-4-turbo",
    claude: "anthropic/claude-3-haiku",
    free: "openai/gpt-3.5-turbo",
    mistral: "mistralai/mistral-7b-instruct",
  };

  const model = modelMap[modelOption] || modelMap["gpt3"];
  return await callOpenRouter(prompt, model);
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

// Utility function to download text as file
export const downloadTextFile = (content, filename) => {
  try {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (error) {
    console.error("Error downloading file:", error);
    alert(
      "Sorry, there was an error downloading the file. Please copy the text manually."
    );
  }
};

// Utility function to copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
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
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy text: ", error);
    // Show fallback message to user
    prompt("Copy this text manually:\n\n" + text);
    return false;
  }
};
