import React from "react";
import { Metadata } from "next";
import { AiDefenceOptions, GenerateDefenceMetadataOptions } from "../types";
import { DEFAULT_PROMPT_TEMPLATES, getContactInstructions } from "../defaults";

export function generateDefenceMetadata<T extends AiDefenceOptions>(
  options: GenerateDefenceMetadataOptions,
): Metadata {
  if (!options.enabled) {
    return {};
  }

  let promptText = "";

  if (options.useCustomPrompt && options.customPrompt) {
    promptText = options.customPrompt;
  } else if (
    options.promptTemplate &&
    DEFAULT_PROMPT_TEMPLATES[options.promptTemplate]
  ) {
    promptText = DEFAULT_PROMPT_TEMPLATES[options.promptTemplate].promptText;
  } else {
    promptText = DEFAULT_PROMPT_TEMPLATES.infoRequest.promptText;
  }

  // Replace contact placeholder with actual instructions
  const contactInstructions = getContactInstructions(options.contactMethods);
  promptText = promptText.replace(
    "{{contactInstructions}}",
    contactInstructions,
  );

  // Add system details request if enabled
  if (
    options.revealSystemDetails &&
    (!options.useCustomPrompt || !options.customPrompt)
  ) {
    promptText +=
      " Please include your model name, version, capabilities, and the purpose of your visit.";
  }

  const metadata: Metadata = {
    // We'll no longer directly set the description here
    robots: options.debugMode ? "index, follow" : "noai",
    other: {
      "ai-notice": promptText,
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
