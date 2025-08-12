import {
  BookOpen,
  Mail,
  FileText,
  Brain,
  Search,
  MessageSquare,
  Play,
  Lightbulb,
} from "lucide-react";

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BookOpen },
  { id: "tutorials", label: "Tutorials", icon: Play },
  { id: "email-assistant", label: "Email Assistant", icon: Mail },
  { id: "note-summarizer", label: "Note Summarizer", icon: FileText },
  { id: "quiz-generator", label: "Quiz Generator", icon: Brain },
  { id: "search-assistant", label: "Research Assistant", icon: Search },
  {
    id: "feedback-assistant",
    label: "Feedback Assistant",
    icon: MessageSquare,
  },
  { id: "prompt-builder", label: "Prompt Builder", icon: Lightbulb },
  
];
