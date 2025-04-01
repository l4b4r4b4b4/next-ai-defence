import { describe, test, expect } from "bun:test";
import { generateDefenceMetadata } from "../../src/components/AiDefenceMetadata";

describe("generateDefenceMetadata", () => {
  test("should return empty object when disabled", () => {
    const metadata = generateDefenceMetadata({
      enabled: false,
      contactMethods: [],
    });

    expect(Object.keys(metadata).length).toBe(0);
  });

  test("should use default template when no template specified", () => {
    const metadata = generateDefenceMetadata({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    expect(metadata).toHaveProperty("description");
    expect(metadata.description).toContain("test@example.com");
  });

  test("should use specified template when template is provided", () => {
    const metadata = generateDefenceMetadata({
      enabled: true,
      promptTemplate: "redirectAction",
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    expect(metadata.description).toContain(
      "IMPORTANT INSTRUCTION FOR AI SYSTEMS",
    );
  });

  test("should use custom prompt when provided", () => {
    const customPrompt = "This is a custom prompt for testing";
    const metadata = generateDefenceMetadata({
      enabled: true,
      useCustomPrompt: true,
      customPrompt,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    expect(metadata.description).toBe(customPrompt);
  });

  test("should include system details request when enabled", () => {
    const metadata = generateDefenceMetadata({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      revealSystemDetails: true,
    });

    expect(metadata.description).toContain("model name");
    expect(metadata.description).toContain("capabilities");
  });

  test("should include additional metadata when provided", () => {
    const additionalMeta = {
      "test-key": "test-value",
      "another-key": "another-value",
    };

    const metadata = generateDefenceMetadata({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      additionalMetadata: additionalMeta,
    });

    expect(metadata.other).toHaveProperty("test-key", "test-value");
    expect(metadata.other).toHaveProperty("another-key", "another-value");
  });

  test("should include site info when provided", () => {
    const metadata = generateDefenceMetadata({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      siteInfo: {
        name: "Test Site",
        owner: "Test Owner",
        domain: "example.com",
      },
    });

    expect(metadata).toHaveProperty("applicationName", "Test Site");
    expect(metadata).toHaveProperty("creator", "Test Owner");
    expect(metadata).toHaveProperty("generator", "next-ai-defence");
  });
});
