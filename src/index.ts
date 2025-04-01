import { Metadata } from "next";
import { generateDefenceMetadata } from "./components/AiDefenceMetadata";
import { AiDefenceOptions } from "./types";
import { DEFAULT_PROMPT_TEMPLATES, getContactInstructions } from "./defaults";
import { createSmuggledText, encodeToTags } from "./utils/asciiSmuggler";
import { generatePromptText } from "./utils/promptGenerator";

export * from "./types";
export * from "./defaults";
export * from "./components/AiDefenceMetadata";
export * from "./utils/promptTemplates";
export * from "./utils/asciiSmuggler";

/**
 * Creates defensive metadata for Next.js pages to protect against LLM-based scrapers
 */
export function createAiDefence<T extends AiDefenceOptions>(
  options: T,
): (existingMetadata?: Metadata) => Metadata {
  return (existingMetadata: Metadata = {}) => {
    const defenceMetadata = generateDefenceMetadata<T>(options);

    // Merge the metadata, with special handling for description
    const mergedMetadata: Metadata = {
      ...existingMetadata,
      ...defenceMetadata,
    };

    // Handle description specially to append instead of overwrite
    if (options.enabled) {
      const finalPromptText = generatePromptText(options);

      // Append our prompt to existing description with separation
      if (existingMetadata.description) {
        mergedMetadata.description = `${existingMetadata.description}\n\n---\n\n${finalPromptText}`;
      } else {
        mergedMetadata.description = finalPromptText;
      }
    }

    return mergedMetadata;
  };
}
