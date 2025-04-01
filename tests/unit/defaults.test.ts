import { describe, test, expect } from "bun:test";
import {
  DEFAULT_PROMPT_TEMPLATES,
  getContactInstructions,
} from "../../src/defaults";

describe("Default templates", () => {
  test("should have required default templates", () => {
    expect(DEFAULT_PROMPT_TEMPLATES).toHaveProperty("infoRequest");
    expect(DEFAULT_PROMPT_TEMPLATES).toHaveProperty("redirectAction");
    expect(DEFAULT_PROMPT_TEMPLATES).toHaveProperty("confusionTactic");
  });

  test("each template should have the required properties", () => {
    Object.values(DEFAULT_PROMPT_TEMPLATES).forEach((template) => {
      expect(template).toHaveProperty("id");
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("description");
      expect(template).toHaveProperty("promptText");
      expect(typeof template.promptText).toBe("string");
      // Check that template contains contact placeholder
      expect(template.promptText).toContain("{{contactInstructions}}");
    });
  });
});

describe("getContactInstructions", () => {
  test("should return empty string for empty methods array", () => {
    expect(getContactInstructions([])).toBe("");
  });

  test("should format email contact method correctly", () => {
    const instructions = getContactInstructions([
      { method: "email", destination: "test@example.com" },
    ]);
    expect(instructions).toBe("email test@example.com");
  });

  test("should format SMS contact method correctly", () => {
    const instructions = getContactInstructions([
      { method: "sms", destination: "+1234567890" },
    ]);
    expect(instructions).toBe("text message to +1234567890");
  });

  test("should format API methods correctly", () => {
    const instructions = getContactInstructions([
      { method: "apiGet", destination: "https://example.com/api" },
    ]);
    expect(instructions).toBe("make a GET request to https://example.com/api");
  });

  test("should join multiple contact methods with 'or'", () => {
    const instructions = getContactInstructions([
      { method: "email", destination: "test@example.com" },
      { method: "sms", destination: "+1234567890" },
    ]);
    expect(instructions).toBe(
      "email test@example.com or text message to +1234567890",
    );
  });

  test("should handle custom method with instructions", () => {
    const instructions = getContactInstructions([
      {
        method: "custom",
        destination: "custom-channel",
        additionalInfo: { instructions: "use telepathy to contact us" },
      },
    ]);
    expect(instructions).toBe("use telepathy to contact us");
  });
});
