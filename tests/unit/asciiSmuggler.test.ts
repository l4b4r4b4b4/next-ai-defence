import { describe, test, expect } from "bun:test";
import {
  encodeToTags,
  createSmuggledText,
  decodeFromTags,
} from "../../src/utils/asciiSmuggler";

describe("ASCII Smuggler utility functions", () => {
  test("encodeToTags should convert text to Unicode Tag characters", () => {
    const original = "Hello, world!";
    const encoded = encodeToTags(original);

    // Encoded text should not be the same as the original
    expect(encoded).not.toBe(original);

    // Length will be different because Unicode Tag characters are surrogate pairs
    // Each ASCII character (1 code unit) becomes a supplementary character (2 code units)
    expect(encoded.length).toBe(original.length * 2);

    // Each character should be in the Unicode Tags block
    for (let i = 0; i < encoded.length; i += 2) {
      const codePoint = encoded.codePointAt(i);
      if (
        i / 2 < original.length &&
        original.charCodeAt(i / 2) >= 0 &&
        original.charCodeAt(i / 2) <= 127
      ) {
        expect(codePoint).toBeGreaterThanOrEqual(0xe0000);
        expect(codePoint).toBeLessThanOrEqual(0xe007f);
      }
    }
  });

  test("decodeFromTags should reverse encodeToTags", () => {
    const original = "Test message 123!";
    const encoded = encodeToTags(original);
    const decoded = decodeFromTags(encoded);

    expect(decoded).toBe(original);
  });

  test("createSmuggledText should combine visible and hidden text", () => {
    const hiddenMessage = "Secret instruction";
    const prefix = "Visible prefix: ";
    const suffix = " (end of message)";

    const smuggled = createSmuggledText(hiddenMessage, prefix, suffix);

    // Should contain prefix and suffix
    expect(smuggled).toContain(prefix);
    expect(smuggled).toContain(suffix);

    // Should contain hidden message (encoded)
    const extracted = decodeFromTags(smuggled);
    expect(extracted).toBe(hiddenMessage);

    // Visible part should be intact
    const visiblePart = prefix + suffix;
    expect(smuggled.length).toBeGreaterThan(visiblePart.length);
  });

  test("encodeToTags should only encode ASCII characters", () => {
    const original = "Hello, 世界!"; // Contains non-ASCII characters
    const encoded = encodeToTags(original);

    // Non-ASCII characters should remain unchanged in the encoded text
    expect(encoded).toContain("世界");

    // When decoded, we should get back only the ASCII part
    const decoded = decodeFromTags(encoded);
    expect(decoded).toBe("Hello, !"); // Only ASCII characters are decoded
  });

  test("createSmuggledText should handle empty inputs", () => {
    expect(createSmuggledText("")).toBe("");
    expect(createSmuggledText("", "prefix")).toBe("prefix");
    expect(createSmuggledText("", "", "suffix")).toBe("suffix");
  });
});
