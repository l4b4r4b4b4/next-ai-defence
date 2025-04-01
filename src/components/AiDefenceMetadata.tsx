import React from "react";
import { Metadata } from "next";
import { AiDefenceOptions, GenerateDefenceMetadataOptions } from "../types";
import { DEFAULT_PROMPT_TEMPLATES, getContactInstructions } from "../defaults";
import { encodeToTags, createSmuggledText } from "../utils/asciiSmuggler";
import { generatePromptText } from "../utils/promptGenerator";

export function generateDefenceMetadata<T extends AiDefenceOptions>(
  options: GenerateDefenceMetadataOptions,
): Metadata {
  if (!options.enabled) {
    return {};
  }

  const finalPromptText = generatePromptText(options);

  const metadata: Metadata = {
    robots: options.debugMode ? "index, follow" : "noai",
    other: {
      "ai-notice": finalPromptText,
      ...options.additionalMetadata,
    },
  };

  if (options.siteInfo) {
    metadata.applicationName = options.siteInfo.name;
    metadata.generator = "next-ai-defence";

    if (options.siteInfo.owner) {
      metadata.creator = options.siteInfo.owner;
    }
  }

  return metadata;
}

interface AiDefenceMetadataProps extends GenerateDefenceMetadataOptions {}

export const AiDefenceMetadata: React.FC<AiDefenceMetadataProps> = (props) => {
  // This is a server component that doesn't render anything visible
  return null;
};
