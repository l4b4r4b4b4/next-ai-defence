import { PromptTemplate } from "../types";

export const createCustomTemplate = (
  id: string,
  name: string,
  description: string,
  promptText: string,
): PromptTemplate => {
  return {
    id,
    name,
    description,
    promptText,
  };
};

export const customizePrompt = (
  basePrompt: string,
  replacements: Record<string, string>,
): string => {
  let customizedPrompt = basePrompt;

  Object.entries(replacements).forEach(([key, value]) => {
    // Use a global regular expression to replace all occurrences
    const regex = new RegExp(`{{${key}}}`, "g");
    customizedPrompt = customizedPrompt.replace(regex, value);
  });

  return customizedPrompt;
};
