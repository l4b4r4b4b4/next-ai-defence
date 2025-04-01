import { describe, test, expect } from "bun:test";
import {
  ContactMethod,
  ContactConfig,
  PromptTemplate,
  AiDefenceOptions,
  GenerateDefenceMetadataOptions,
} from "../../src/types";

describe("Type definitions", () => {
  test("ContactMethod should be type-checked correctly", () => {
    // This is a type-level test, we're just making sure it compiles
    const methods: ContactMethod[] = [
      "email",
      "sms",
      "messenger",
      "apiGet",
      "apiPost",
      "webhook",
      "custom",
    ];
    expect(methods.length).toBe(7);
  });

  test("ContactConfig type should be structurally valid", () => {
    const config: ContactConfig = {
      method: "email",
      destination: "test@example.com",
    };

    const configWithExtras: ContactConfig = {
      method: "apiPost",
      destination: "https://example.com/api",
      customHeaders: { "x-api-key": "test-key" },
      additionalInfo: { purpose: "testing" },
    };

    expect(config.method).toBe("email");
    expect(configWithExtras.customHeaders?.["x-api-key"]).toBe("test-key");
  });

  test("AiDefenceOptions should accept valid configurations", () => {
    const options: AiDefenceOptions = {
      enabled: true,
      promptTemplate: "infoRequest",
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    };

    expect(options.enabled).toBe(true);
    expect(options.contactMethods.length).toBe(1);
  });

  test("GenerateDefenceMetadataOptions should extend AiDefenceOptions", () => {
    const options: GenerateDefenceMetadataOptions = {
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      siteInfo: {
        name: "Test Site",
        domain: "example.com",
      },
    };

    expect(options.siteInfo?.name).toBe("Test Site");
  });
});
