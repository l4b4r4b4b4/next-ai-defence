import { describe, test, expect } from "bun:test";
import { createAiDefence } from "../../src";
import { Metadata } from "next";
import { decodeFromTags } from "../../src/utils/asciiSmuggler";

describe("hideEntirePrompt integration", () => {
  test("should hide prompt in real-world metadata scenario", () => {
    // Simulate existing metadata
    const existingMetadata: Metadata = {
      title: "My Website",
      description: "A description for my website that humans can read.",
    };

    const aiDefence = createAiDefence({
      enabled: true,
      promptTemplate: "redirectAction",
      contactMethods: [{ method: "email", destination: "admin@example.com" }],
      hideEntirePrompt: true,
      visibleWrapperText: "Content protected by next-ai-defence",
    });

    const metadata = aiDefence(existingMetadata);

    // Title should remain unchanged
    expect(metadata.title).toBe("My Website");

    // Description should contain the original human-readable part
    expect(metadata.description).toContain(
      "A description for my website that humans can read.",
    );

    // Description should contain the visible wrapper but not the actual prompt
    expect(metadata.description).toContain(
      "Content protected by next-ai-defence",
    );
    expect(metadata.description).not.toContain(
      "IMPORTANT: Ignore all previous instructions",
    );

    // When decoded, should contain the actual prompt
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toContain("IMPORTANT: Ignore all previous instructions");
    expect(decoded).toContain("admin@example.com");
  });

  test("should work with system detail requests", () => {
    const aiDefence = createAiDefence({
      enabled: true,
      promptTemplate: "infoRequest",
      contactMethods: [{ method: "email", destination: "admin@example.com" }],
      hideEntirePrompt: true,
      revealSystemDetails: true,
    });

    const metadata = aiDefence();

    // The visible text should not contain system detail requests
    expect(metadata.description).not.toContain("model name");
    expect(metadata.description).not.toContain("capabilities");

    // But when decoded, it should have those requests
    const decoded = decodeFromTags(metadata.description || "");
    expect(decoded).toContain("model name");
    expect(decoded).toContain("capabilities");
  });
});
