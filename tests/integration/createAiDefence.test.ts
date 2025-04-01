import { describe, test, expect } from "bun:test";
import { createAiDefence } from "../../src";

describe("createAiDefence integration", () => {
  test("should return a function", () => {
    const aiDefence = createAiDefence({
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    expect(typeof aiDefence).toBe("function");
  });

  test("returned function should generate metadata", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    const metadata = aiDefence();
    expect(metadata).toHaveProperty("description");
    expect(metadata).toHaveProperty("robots");
    expect(metadata).toHaveProperty("other");
  });

  test("should respect all provided options", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      useCustomPrompt: true,
      customPrompt: "Custom integration test prompt",
      contactMethods: [
        { method: "email", destination: "test@example.com" },
        { method: "sms", destination: "+1234567890" },
      ],
      revealSystemDetails: true,
      additionalMetadata: {
        "custom-header": "custom-value",
      },
      debugMode: true,
    });

    const metadata = aiDefence();
    expect(metadata.description).toBe("Custom integration test prompt");
    expect(metadata.robots).toBe("index, follow"); // Debug mode
    expect(metadata.other).toHaveProperty("custom-header", "custom-value");
  });

  test("should compose with other metadata", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    // Simulate how users would combine with their own metadata
    const combinedMetadata = {
      title: "My Page Title",
      description: "My original description",
      ...aiDefence(), // This should override the description
    };

    expect(combinedMetadata.title).toBe("My Page Title");
    expect(combinedMetadata.description).not.toBe("My original description");
    expect(combinedMetadata).toHaveProperty("robots");
  });
});
