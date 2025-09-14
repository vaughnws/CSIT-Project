import { StackClientApp } from '@stackframe/react';

export const stackClientApp = new StackClientApp({
  projectId: process.env.REACT_APP_STACK_PROJECT_ID || "eea69575-c27b-4bed-ad4d-2042352674d9",
  publishableClientKey: process.env.REACT_APP_STACK_PUBLISHABLE_CLIENT_KEY || "pck_6cfcdesgca7dew1f4w5g1d9e9wbg0qjmjgncqy510j840",
  tokenStore: 'cookie',
});