export * from "./types";
export * from "./defaults";
export * from "./components/AiDefenceMetadata";
export * from "./utils/promptTemplates";

// Convenience function for applying defense in Next.js metadata
import { Metadata } from "next";
import { generateDefenceMetadata } from "./components/AiDefenceMetadata";
import { AiDefenceOptions } from "./types";

/**
 * Creates defensive metadata for Next.js pages to protect against LLM-based scrapers
 */
export function createAiDefence<T extends AiDefenceOptions>(
  options: T,
): () => Metadata {
  return () => generateDefenceMetadata<T>(options);
}
