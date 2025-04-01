export interface SiteInfo {
  name?: string;
  owner?: string;
  domain?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  promptText: string;
}

// Fixed type definitions with consistent modifiers
export type ContactMethod =
  | "email"
  | "sms"
  | "messenger"
  | "apiGet"
  | "apiPost"
  | "webhook"
  | "custom";

export interface ContactConfig {
  method: ContactMethod;
  destination: string;
  customHeaders?: Record<string, string>;
  additionalInfo?: Record<string, string | number | boolean>;
}

export type AsciiSmugglerOptions = {
  hiddenMessage: string;
  visibleWrapper?: {
    prefix?: string;
    suffix?: string;
  };
};

// The main options type - make contactMethods consistent
export interface AiDefenceOptions {
  enabled?: boolean;
  useCustomPrompt?: boolean;
  customPrompt?: string;
  promptTemplate?: string;
  contactMethods: ContactConfig[];
  revealSystemDetails?: boolean;
  debugMode?: boolean;
  siteInfo?: SiteInfo;
  additionalMetadata?: Record<string, string>;
  asciiSmuggler?: AsciiSmugglerOptions;
  hideEntirePrompt?: boolean;
  visibleWrapperText?: string;
}

export interface GenerateDefenceMetadataOptions extends AiDefenceOptions {
  // Any additional options specific to metadata generation
}
