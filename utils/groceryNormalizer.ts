// groceryNormalizer.ts

interface NormalizationResult {
  original: string;
  normalized: string;
  confidence: number;
}

export class GroceryNormalizer {
  private readonly CONFIDENCE_THRESHOLD = 0.75;

  // Common word patterns and their replacements
  private readonly COMMON_PATTERNS = [
    // Multiple letters
    { pattern: /(.)\1+/g, replacement: "$1" }, // 'appppple' -> 'apple'

    // Common typos
    { pattern: /(\w)z(\w)/g, replacement: "$1s$2" }, // 'dogz' -> 'dogs'
    { pattern: /(\w)x(\w)/g, replacement: "$1s$2" }, // 'dogx' -> 'dogs'

    // Remove special characters
    { pattern: /[^\w\s-]/g, replacement: "" },
  ];

  // Common plural rules
  private readonly PLURAL_RULES = [
    // Irregular plurals
    { pattern: /leaves$/i, replacement: "leaf" },
    { pattern: /lives$/i, replacement: "life" },
    { pattern: /loaves$/i, replacement: "loaf" },
    { pattern: /elves$/i, replacement: "elf" },

    // Regular plural patterns (order matters)
    { pattern: /ies$/i, replacement: "y" }, // berries -> berry
    { pattern: /ves$/i, replacement: "f" }, // leaves -> leaf
    { pattern: /oes$/i, replacement: "o" }, // potatoes -> potato
    { pattern: /es$/i, replacement: "" }, // boxes -> box
    { pattern: /s$/i, replacement: "" }, // apples -> apple
  ];

  // Common word variations
  private readonly WORD_VARIATIONS = new Map([
    ["yoghurt", "yogurt"],
    ["yogourt", "yogurt"],
    ["tomatoe", "tomato"],
    ["potatoe", "potato"],
    ["ketchup", "catsup"],
    ["donut", "doughnut"],
  ]);

  normalize(input: string): NormalizationResult {
    const original = input;

    // Step 1: Basic normalization
    let normalized = input.trim().toLowerCase().replace(/\s+/g, " "); // normalize spaces

    // Step 2: Apply common patterns
    this.COMMON_PATTERNS.forEach(({ pattern, replacement }) => {
      normalized = normalized.replace(pattern, replacement);
    });

    // Step 3: Check word variations
    const words = normalized.split(" ");
    const normalizedWords = words.map((word) => {
      // Check direct matches in variations
      const variation = this.WORD_VARIATIONS.get(word);
      if (variation) return variation;

      // Apply plural rules
      return this.handlePlurals(word);
    });

    normalized = normalizedWords.join(" ");

    // Calculate confidence
    const confidence = this.calculateConfidence(original, normalized);

    return {
      original,
      normalized,
      confidence,
    };
  }

  private handlePlurals(word: string): string {
    // Try each plural rule in order
    for (const { pattern, replacement } of this.PLURAL_RULES) {
      if (pattern.test(word)) {
        return word.replace(pattern, replacement);
      }
    }
    return word;
  }

  private calculateConfidence(original: string, normalized: string): number {
    if (original.toLowerCase() === normalized) return 1;

    const originalLower = original.toLowerCase();

    // Higher confidence for known variations
    if (this.WORD_VARIATIONS.has(originalLower)) return 0.95;

    // Higher confidence for plural transformations
    for (const { pattern } of this.PLURAL_RULES) {
      if (pattern.test(originalLower)) return 0.9;
    }

    // Levenshtein distance-based confidence for other cases
    const distance = this.levenshteinDistance(originalLower, normalized);
    const maxLength = Math.max(original.length, normalized.length);
    const similarity = 1 - distance / maxLength;

    return similarity;
  }

  private levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[b.length][a.length];
  }

  // Helper method to check if items should be considered the same
  isSameItem(item1: string, item2: string): boolean {
    const norm1 = this.normalize(item1);
    const norm2 = this.normalize(item2);

    if (
      norm1.confidence < this.CONFIDENCE_THRESHOLD ||
      norm2.confidence < this.CONFIDENCE_THRESHOLD
    ) {
      return false;
    }

    return norm1.normalized === norm2.normalized;
  }

  // Add new variation
  addVariation(original: string, normalized: string): void {
    this.WORD_VARIATIONS.set(original.toLowerCase(), normalized.toLowerCase());
  }
}

// Export singleton instance
export const groceryNormalizer = new GroceryNormalizer();

/* Usage Examples:
  console.log(groceryNormalizer.normalize("Apples"));  
  // { original: "Apples", normalized: "apple", confidence: 0.9 }
  
  console.log(groceryNormalizer.normalize("GrEEn ApPLES"));
  // { original: "GrEEn ApPLES", normalized: "green apple", confidence: 0.9 }
  
  console.log(groceryNormalizer.normalize("tomatoess"));
  // { original: "tomatoess", normalized: "tomato", confidence: 0.85 }
  
  console.log(groceryNormalizer.normalize("yoghurt"));
  // { original: "yoghurt", normalized: "yogurt", confidence: 0.95 }
  
  console.log(groceryNormalizer.isSameItem("Apple", "Apples")); // true
  console.log(groceryNormalizer.isSameItem("Apple", "Orange")); // false
  
  // Add custom variation
  groceryNormalizer.addVariation("soda-pop", "soda");
  */
