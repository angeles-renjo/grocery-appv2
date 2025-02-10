export class GroceryNormalizer {
  private readonly CONFIDENCE_THRESHOLD = 0.7;

  normalize(input: string) {
    if (!input) return { normalized: "", confidence: 0, original: input };

    // Step 1: Convert to lowercase
    let normalized = input.toLowerCase();

    // Step 2: Remove common quantity indicators
    normalized = normalized
      .replace(/x\s*\d+/, "") // "egg x2" → "egg"
      .replace(/^\d+\s+/, "") // "2 eggs" → "eggs"
      .replace(/\(\d+\)/, "") // "eggs(2)" → "eggs"
      .replace(/dozen|dz/, "") // "dozen eggs" → "eggs"
      .replace(/piece|pc|pcs/, ""); // "egg piece" → "egg"

    // Step 3: Clean special characters and extra spaces
    normalized = normalized
      .replace(/[^a-z0-9\s]/g, " ") // Replace special chars with space
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();

    // Step 4: Remove spaces between letters
    normalized = normalized.replace(/([a-z])\s+([a-z])/g, "$1$2"); // "e g g s" → "eggs"

    // Step 5: Handle plural forms
    normalized = normalized
      .replace(/(\w+)(es|s)$/, "$1") // eggs → egg, apples → apple
      .replace(/(\w+)(ies)$/, "$1y"); // berries → berry

    // Debug logging
    console.log("Normalization steps:", {
      original: input,
      afterQuantity: normalized,
      final: normalized,
      steps: {
        input,
        lowercase: input.toLowerCase(),
        cleaned: normalized,
      },
    });

    return {
      normalized,
      confidence: 1.0,
      original: input,
    };
  }

  isSameItem(item1: string, item2: string): boolean {
    if (!item1 || !item2) return false;

    const norm1 = this.normalize(item1);
    const norm2 = this.normalize(item2);

    // Debug logging
    console.log("Comparing items:", {
      item1Original: item1,
      item2Original: item2,
      item1Normalized: norm1.normalized,
      item2Normalized: norm2.normalized,
      isMatch: norm1.normalized === norm2.normalized,
    });

    return norm1.normalized === norm2.normalized;
  }
}

export const groceryNormalizer = new GroceryNormalizer();
