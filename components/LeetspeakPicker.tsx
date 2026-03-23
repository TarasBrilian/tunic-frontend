"use client";

import { useState, useEffect } from "react";
import { generateLeetspeakVariants } from "@/lib/leetspeak";

interface LeetspeakPickerProps {
  variant: string | null;
  onChange: (variant: string | null) => void;
  disabled: boolean;
  position: "prefix" | "suffix" | "combine";
  label?: string;
}

export function LeetspeakPicker({ variant, onChange, disabled, position, label }: LeetspeakPickerProps) {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name) {
      setVariants([]);
      setError(false);
      onChange(null);
      return;
    }
    const results = generateLeetspeakVariants(name);
    setError(results.length === 0);
    if (results.length > 0) {
      setVariants(results);
      if (!results.includes(variant || "")) {
        onChange(results[0]);
      }
    } else {
      setVariants([]);
      onChange(null);
    }
  }, [name, onChange, variant]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
  };

  return (
    <div id="name-section">
      <div className="field">
        <label className="field-label">{label || "Your name or word"}</label>
        <div className="input-wrap">
          <input
            className={`input ${error ? "is-error" : ""}`}
            type="text"
            placeholder="e.g. CAFE"
            maxLength={6}
            value={name}
            onChange={handleInput}
            disabled={disabled}
            autoComplete="off"
          />
          <span className="input-count">{name.length}/6</span>
        </div>
        {error && name.length > 0 && (
          <div className="field-error visible">
            No valid hex characters found. Try a different word.
          </div>
        )}
      </div>

      <div id="variants-section" className={variants.length === 0 ? "hidden" : ""}>
        <div className="variants-label">Choose a variant</div>
        <div className="variants-grid">
          {variants.map((v) => (
            <button
              key={v}
              type="button"
              disabled={disabled}
              className={`variant-btn ${variant === v ? "selected" : ""}`}
              onClick={() => onChange(v)}
            >
              <span className="variant-val">{v}</span>
              <span className="variant-hint">
                {position === "combine" ? `0x${v}...${v}` : position === "suffix" ? `0x...${v}` : `0x${v}...`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
