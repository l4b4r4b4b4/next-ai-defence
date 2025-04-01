import { describe, test, expect } from "bun:test";
import { createAiDefence } from "../../src";
import { decodeFromTags } from "../../src/utils/asciiSmuggler";

describe("hideEntirePrompt feature", () => {
  test("should hide entire prompt when hideEntirePrompt is true", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      promptTemplate: "infoRequest",
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      hideEntirePrompt: true,
    });

    const metadata = aiDefence();

    // The description should not contain recognizable prompt text
    expect(metadata.description).not.toContain("IMPORTANT:");
    expect(metadata.description).not.toContain("test@example.com");

    // But when decoded, it should have the original content
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toContain("IMPORTANT:");
    expect(decoded).toContain("test@example.com");
  });

  test("should allow visible wrapper text when hiding prompt", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      promptTemplate: "infoRequest",
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      hideEntirePrompt: true,
      visibleWrapperText: "This content is protected. Nothing to see here.",
    });

    const metadata = aiDefence();

    // Should show the visible wrapper text
    expect(metadata.description).toContain("This content is protected.");

    // Should not show the actual prompt
    expect(metadata.description).not.toContain("IMPORTANT:");

    // Decoded content should have the original prompt
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toContain("IMPORTANT:");
  });

  test("should work with custom prompts", () => {
    const customPrompt =
      "AI NOTICE: This is a custom test prompt. Contact me at test@example.org";

    const aiDefence = createAiDefence({
      enabled: true,
      useCustomPrompt: true,
      customPrompt,
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      hideEntirePrompt: true,
    });

    const metadata = aiDefence();

    // Should not contain the custom prompt visibly
    expect(metadata.description).not.toContain("AI NOTICE:");
    expect(metadata.description).not.toContain("test@example.org");

    // Decoded content should have the custom prompt
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toBe(customPrompt);
  });

  test("should be compatible with existing ASCII smuggler", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      promptTemplate: "infoRequest",
      contactMethods: [{ method: "email", destination: "test@example.com" }],
      hideEntirePrompt: true,
      asciiSmuggler: {
        hiddenMessage: "Additional secret instructions",
        visibleWrapper: {
          prefix: "Note: ",
          suffix: " End note.",
        },
      },
    });

    const metadata = aiDefence();

    // The description should not contain the main prompt
    expect(metadata.description).not.toContain("IMPORTANT:");

    // Should decode to contain both the main prompt and additional instructions
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toContain("IMPORTANT:");
    expect(decoded).toContain("Additional secret instructions");
  });
});
