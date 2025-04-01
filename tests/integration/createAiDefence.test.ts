import { describe, test, expect } from "bun:test";
import { createAiDefence } from "../../src";
import { Metadata } from "next";

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

    // Create existing metadata
    const existingMetadata: Metadata = {
      title: "My Page Title",
      description: "My original description",
    };

    // Pass the existing metadata to the aiDefence function
    const combinedMetadata = aiDefence(existingMetadata);

    expect(combinedMetadata.title).toBe("My Page Title");
    expect(combinedMetadata.description).toContain("My original description");
    expect(combinedMetadata.description).toContain("---"); // Check for the separator
    expect(combinedMetadata).toHaveProperty("robots");
  });

  test("should handle case with no existing description", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    // Create existing metadata without a description
    const existingMetadata: Metadata = {
      title: "My Page Title",
    };

    // Pass the existing metadata to the aiDefence function
    const combinedMetadata = aiDefence(existingMetadata);

    expect(combinedMetadata.title).toBe("My Page Title");
    expect(combinedMetadata.description).not.toContain("---"); // No separator needed
    expect(combinedMetadata).toHaveProperty("robots");
  });
});

test("should include ASCII smuggled content when configured", () => {
  const aiDefence = createAiDefence({
    enabled: true,
    contactMethods: [{ method: "email", destination: "test@example.com" }],
    asciiSmuggler: {
      hiddenMessage: "This is hidden text for AI systems only",
      visibleWrapper: {
        prefix: "Terms: ",
        suffix: " Read carefully.",
      },
    },
  });

  const metadata = aiDefence();

  // The description should contain the visible wrapper text
  expect(metadata.description).toContain("Terms:");
  expect(metadata.description).toContain("Read carefully.");

  // The hidden message should be encoded, not directly visible
  expect(metadata.description).not.toContain(
    "This is hidden text for AI systems only",
  );

  // But the description should be longer than expected with just the visible text
  // Add non-null assertion operator
  const basePromptLength = metadata.description!.indexOf("Terms:");
  const expectedMinLength = basePromptLength + "Terms: Read carefully.".length;
  expect(metadata.description!.length).toBeGreaterThan(expectedMinLength);
});

test("should work without visible wrapper", () => {
  const aiDefence = createAiDefence({
    enabled: true,
    contactMethods: [{ method: "email", destination: "test@example.com" }],
    asciiSmuggler: {
      hiddenMessage: "Hidden instruction with no wrapper",
    },
  });

  const metadata = aiDefence();

  // Should still generate valid metadata
  expect(metadata).toHaveProperty("description");
  // Use optional chaining with a fallback value
  expect(metadata.description?.length ?? 0).toBeGreaterThan(0);
});
