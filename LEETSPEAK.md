# LEETSPEAK.md

> Part of Tunic — Beautiful Addresses, Made for You

---

## 1. Feature Overview

The Leetspeak Converter is an additional input method in Tunic that allows users to enter a meaningful string such as a name, word, or abbreviation. The system converts that string into up to 4 hex-compatible variations that can be used as a vanity address pattern.

Example: user inputs `cafe`, system generates variations like `51991`. User picks one, and that variation is passed to the brute-force engine as a pattern just like any manually entered pattern.

This strengthens Tunic's value proposition: an address that is not just visually pretty, but personally meaningful to the user.

---

## 2. Why This Feature Exists

EVM addresses only contain hex characters: `0-9` and `a-f`. Names like "cafe", "rizal", or "bagas" contain characters that do not exist in the hex alphabet (`n`, `h`, `z`, etc.). Without conversion, users cannot directly use their name as a pattern.

The Leetspeak Converter bridges this by mapping alphabet characters to visually similar characters or digits that are still valid within the hex alphabet.

---

## 3. Hex Alphabet Constraint

Valid characters in an EVM address (after `0x`):

```
0 1 2 3 4 5 6 7 8 9 a b c d e f
```

Every pattern produced by the converter must consist solely of these characters. Any character outside this range cannot appear in any EVM address.

---

## 4. Mapping Table

Mapping from alphabet characters to hex-compatible substitutions:

| Input Character | Hex Substitution | Notes |
|---|---|---|
| `a` | `4` | visual similarity |
| `b` | `8` | visual similarity |
| `c` | `c` | already hex valid |
| `d` | `d` | already hex valid |
| `e` | `3` | visual similarity |
| `f` | `f` | already hex valid |
| `g` | `9` | visual similarity |
| `i` | `1` | visual similarity |
| `l` | `1` | visual similarity |
| `o` | `0` | visual similarity |
| `s` | `5` | visual similarity |
| `t` | `7` | visual similarity |
| `0` | `0` | already hex valid |
| `1` | `1` | already hex valid |
| `2` | `2` | already hex valid |
| `3` | `3` | already hex valid |
| `4` | `4` | already hex valid |
| `5` | `5` | already hex valid |
| `6` | `6` | already hex valid |
| `7` | `7` | already hex valid |
| `8` | `8` | already hex valid |
| `9` | `9` | already hex valid |

Characters not in this table (`n`, `h`, `z`, `r`, `k`, `m`, `p`, `q`, etc.) have no hex-compatible substitution and must be handled as described in section 6.

---

## 5. How the Converter Works

### Step 1: Normalize Input
Input is lowercased and trimmed. Spaces and non-alphanumeric characters are rejected before processing.

### Step 2: Per-character Mapping
Each character is checked against the mapping table:
- If the character has a substitution, it enters the candidate pool
- If the character has no substitution, it is a blocker and is skipped

### Step 3: Generate Variations
From the successfully mapped characters, generate up to 4 visually distinct variations. Variations are produced by combining letter and digit representations differently for characters that have multiple valid forms (for example, `e` can stay as `e` or become `3`, `a` can stay as `a` or become `4`).

Example for input `cafe`:
- `cafe`
- `c4fe`
- `caf3`
- `c4f3`

### Step 4: Filter and Deduplicate
Identical variations are removed. All remaining variations are re-validated to ensure every character is within the hex alphabet before being returned.

### Step 5: Present to User
Up to 4 variations are displayed. The user selects one, which is then passed as a pattern to the WASM engine.

---

## 6. Edge Cases and Handling

### Input contains characters with no substitution
Example: `cafe` where `n` and `h` have no hex-compatible substitution.

Handling: characters that cannot be converted are skipped, not rejected. The system still attempts to produce variations from the convertible characters. The UI should inform the user that some characters could not be represented in hex.

Example: `cafe` converts the valid characters and produces `51991` (n and h are skipped).

### Result is too short after conversion
If the resulting pattern is shorter than 3 characters after conversion, the system does not proceed and prompts the user to try a different input.

### Input exceeds 6 characters
Input is capped at 6 characters before processing. This validation happens in the UI before the converter function is called.

### No characters can be converted
If none of the input characters have a hex-compatible substitution, a clear error message is shown and the user is asked to try a different name or word.

### Input is already fully hex-valid
If the user enters a string where all characters are already hex-valid (e.g. `cafe`, `bad`, `face`), the converter still runs and includes the original input as one of the variations.

---

## 7. Architecture and File Location

Following the Tunic project structure:

```
tunic/
└── frontend/
    └── src/
        └── lib/
            └── leetspeak.ts        # All converter logic lives here
```

This is a pure TypeScript utility. No external dependencies, no network calls, no interaction with WASM. The output is a plain string array that is rendered directly as selectable options in the UI.

---

## 8. Expected Interface

The AI agent implementing `leetspeak.ts` must follow this interface:

```typescript
// Input: user string, max 6 characters, already validated by UI
// Output: array of strings, max 4 variations, all hex-valid
function generateLeetspeakVariants(input: string): string[]

// Input: single character
// Output: array of possible hex-compatible substitutions for that character
// Returns empty array if no substitution exists
function getHexSubstitutions(char: string): string[]

// Input: string
// Output: true if all characters are valid hex, false otherwise
function isHexCompatible(str: string): boolean
```

### Expected behavior of `generateLeetspeakVariants`:

- Input is lowercased before processing
- Characters without substitution are skipped, not thrown as errors
- Output is deduplicated
- Output is capped at 4 items
- Every item in the output is confirmed hex-valid
- If the output array is empty, no character in the input could be converted

---

## 9. Input and Output Examples

| Input | Output Variations |
|---|---|
| `cafe` | `["cafe", "c4fe", "caf3", "c4f3"]` |
| `dead` | `["dead", "d3ad", "de4d", "d34d"]` |
| `face` | `["face", "f4ce", "fac3", "f4c3"]` |
| `bagas` | `["8494", "b494", "8a94", "ba94"]` |

Note: actual output depends on the variation generation logic in step 3. The examples above are illustrative, not a strict expected output.

---

## 10. UI Integration

Flow in the frontend:

```
user clicks "Use a Name" tab
        ↓
user inputs string (max 6 characters)
        ↓
frontend validates: not empty, no spaces, max 6 characters
        ↓
call generateLeetspeakVariants(input)
        ↓
if output is empty → show error message
if output has items → render as selectable cards
        ↓
user selects one variation
        ↓
selected variation passed to useVanityGenerator as pattern
        ↓
generation runs as normal (suffix mode by default)
```

The "Use a Name" tab is an additional input method alongside the existing "Enter Pattern" tab. Both feed into the same downstream flow: pattern to WASM brute-force engine.

---

## 11. Updated Project Structure

With this feature added, the relevant Tunic project structure becomes:

```
tunic/
├── engine/
│   ├── src/
│   │   ├── lib.rs
│   │   ├── generator.rs
│   │   ├── matcher.rs
│   │   └── crypto.rs
│   └── Cargo.toml
│
└── frontend/
    └── src/
        ├── app/
        │   └── page.tsx
        ├── components/
        │   ├── InputForm.tsx
        │   ├── ResultCard.tsx
        │   └── LeetspeakPicker.tsx    # renders up to 4 variations as selectable cards
        ├── hooks/
        │   └── useVanityGenerator.ts
        ├── workers/
        │   └── vanity.worker.ts
        └── lib/
            └── leetspeak.ts           # converter logic
```