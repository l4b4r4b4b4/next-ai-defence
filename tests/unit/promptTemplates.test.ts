import { describe, test, expect } from "bun:test";
import {
  createCustomTemplate,
  customizePrompt,
} from "../../src/utils/promptTemplates";

describe("createCustomTemplate", () => {
  test("should create a valid template object", () => {
    const template = createCustomTemplate(
      "test-id",
      "Test Template",
      "A template for testing",
      "This is a {{custom}} prompt for testing",
    );

    expect(template.id).toBe("test-id");
    expect(template.name).toBe("Test Template");
    expect(template.description).toBe("A template for testing");
    expect(template.promptText).toBe("This is a {{custom}} prompt for testing");
  });
});

describe("customizePrompt", () => {
  test("should replace placeholders with provided values", () => {
    const basePrompt = "Hello {{name}}, welcome to {{place}}!";
    const customized = customizePrompt(basePrompt, {
      name: "User",
      place: "Our Website",
    });

    expect(customized).toBe("Hello User, welcome to Our Website!");
  });

  test("should handle multiple occurrences of the same placeholder", () => {
    const basePrompt = "{{value}} + {{value}} = 2 times {{value}}";
    const customized = customizePrompt(basePrompt, {
      value: "x",
    });

    expect(customized).toBe("x + x = 2 times x");
  });

  test("should ignore placeholders without replacements", () => {
    const basePrompt = "Hello {{name}}, your {{status}} is good";
    const customized = customizePrompt(basePrompt, {
      name: "User",
      // No replacement for status
    });

    expect(customized).toBe("Hello User, your {{status}} is good");
  });
});
