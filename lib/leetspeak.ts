export function getHexSubstitutions(char: string): string[] {
  const c = char.toLowerCase();
  switch (c) {
    case "a": return ["a", "4"];
    case "b": return ["b", "8"];
    case "c": return ["c"];
    case "d": return ["d"];
    case "e": return ["e", "3"];
    case "f": return ["f"];
    case "g": return ["9"];
    case "i": return ["1"];
    case "l": return ["1"];
    case "o": return ["0"];
    case "s": return ["5"];
    case "t": return ["7"];
    case "0": return ["0"];
    case "1": return ["1"];
    case "2": return ["2"];
    case "3": return ["3"];
    case "4": return ["4"];
    case "5": return ["5"];
    case "6": return ["6"];
    case "7": return ["7"];
    case "8": return ["8"];
    case "9": return ["9"];
    default: return []; // characters with no mapping
  }
}

export function isHexCompatible(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

export function generateLeetspeakVariants(input: string): string[] {
  const normalized = input.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  if (!normalized) return [];

  const possibilities: string[][] = [];
  for (const char of normalized) {
    const subs = getHexSubstitutions(char);
    if (subs.length > 0) {
      possibilities.push(subs);
    }
  }

  if (possibilities.length === 0) return [];

  let variants: string[] = [""];
  for (const subs of possibilities) {
    const nextVariants: string[] = [];
    for (const prefix of variants) {
      for (const sub of subs) {
        nextVariants.push(prefix + sub);
      }
    }
    variants = nextVariants;
  }

  // Filter valid hex strings >= 3 length
  const validVariants = variants.filter(v => v.length >= 1 && isHexCompatible(v));

  // Deduplicate
  const uniqueVariants = Array.from(new Set(validVariants));
  
  return uniqueVariants.slice(0, 4);
}
