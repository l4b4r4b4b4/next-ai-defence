/**
 * Converts regular text to hidden Unicode Tag characters
 * that are invisible to humans but can be processed by LLMs
 */
export function encodeToTags(text: string): string {
  return Array.from(text) // Use Array.from to properly handle Unicode characters
    .map((char) => {
      const code = char.charCodeAt(0);
      // Only encode ASCII characters (0-127)
      if (code >= 0 && code <= 127) {
        // Convert to Unicode Tags block (U+E0000 to U+E007F)
        return String.fromCodePoint(0xe0000 + code);
      }
      return char;
    })
    .join("");
}

/**
 * Creates text with hidden ASCII smuggled content
 */
export function createSmuggledText(
  hiddenMessage: string,
  visiblePrefix: string = "",
  visibleSuffix: string = "",
): string {
  const encodedMessage = encodeToTags(hiddenMessage);
  return `${visiblePrefix}${encodedMessage}${visibleSuffix}`;
}

/**
 * Extracts hidden text from Unicode Tag characters
 * (For debugging purposes)
 */
export function decodeFromTags(text: string): string {
  let result = "";

  // Use Array.from to properly handle Unicode characters
  for (const char of Array.from(text)) {
    const code = char.codePointAt(0);
    if (code && code >= 0xe0000 && code <= 0xe007f) {
      // Convert back from Unicode Tags block to ASCII
      result += String.fromCodePoint(code - 0xe0000);
    }
  }

  return result;
}
