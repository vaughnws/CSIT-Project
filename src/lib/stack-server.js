import { StackServerApp } from "@stackframe/react";

export const stackServerApp = new StackServerApp({
  projectId: process.env.STACK_PROJECT_ID,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
});

// Helper function to verify Stack Auth tokens
export const verifyStackToken = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const user = await stackServerApp.getUser(token);
    return user;
  } catch (error) {
    console.error('Error verifying Stack token:', error);
    return null;
  }
};