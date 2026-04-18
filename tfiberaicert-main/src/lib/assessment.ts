export type Question = {
  id: number;
  question: string;
  options: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Which AI tool is widely used for generating natural language responses and drafting documents?",
    options: ["ChatGPT", "Photoshop", "Excel", "Outlook"],
  },
  {
    id: 2,
    question:
      "Google NotebookLM is primarily designed to help users with which of the following tasks?",
    options: [
      "Editing videos",
      "Summarising and analysing documents",
      "Building mobile apps",
      "Designing graphics",
    ],
  },
  {
    id: 3,
    question:
      "Perplexity AI is best described as which type of platform?",
    options: [
      "AI-powered search & research assistant",
      "Music streaming service",
      "File backup tool",
      "Image editor",
    ],
  },
  {
    id: 4,
    question:
      "What is the most important best-practice when using AI tools in administrative work?",
    options: [
      "Share confidential data freely",
      "Trust outputs without review",
      "Verify outputs and protect sensitive information",
      "Avoid using AI entirely",
    ],
  },
];
