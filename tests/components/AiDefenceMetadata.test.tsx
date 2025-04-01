import { describe, test, expect } from "bun:test";
import { AiDefenceMetadata } from "../../src/components/AiDefenceMetadata";
import React from "react";

describe("AiDefenceMetadata component", () => {
  test("should render without errors", () => {
    // Since this component doesn't render anything visible,
    // we're just testing that it doesn't throw any errors
    const result = AiDefenceMetadata({
      contactMethods: [{ method: "email", destination: "test@example.com" }],
    });

    expect(result).toBe(null);
  });
});
