export type ContactMethod =
  | "email"
  | "sms"
  | "messenger"
  | "apiGet"
  | "apiPost"
  | "webhook"
  | "custom";

export type ContactConfig = {
  method: ContactMethod;
  destination: string;
  customHeaders?: Record<string, string>;
  additionalInfo?: Record<string, string>;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  promptText: string;
};

export interface AiDefenceOptions<T extends ContactMethod = ContactMethod> {
  enabled?: boolean;
  useCustomPrompt?: boolean;
  customPrompt?: string;
  promptTemplate?: string;
  contactMethods: Array<ContactConfig & { method: T }>;
  revealSystemDetails?: boolean;
  additionalMetadata?: Record<string, string>;
  debugMode?: boolean;
}

export interface GenerateDefenceMetadataOptions extends AiDefenceOptions {
  siteInfo?: {
    name: string;
    owner?: string;
    domain: string;
  };
}
