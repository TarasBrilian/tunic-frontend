"use client";

import { useState, useEffect } from "react";

interface Base58InputProps {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled: boolean;
}

export function Base58Input({ label, value, onChange, disabled }: Base58InputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [error, setError] = useState<string | null>(null);

  const base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  useEffect(() => {
    if (value === null) {
      setInputValue("");
    }
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val) {
      setError(null);
      onChange(null);
      return;
    }

    const isInvalid = Array.from(val).some(char => !base58Chars.includes(char));
    if (isInvalid) {
      setError("Invalid Base58 characters (no 0, O, I, l)");
      onChange(null);
    } else {
      setError(null);
      onChange(val);
    }
  };

  return (
    <div className="field">
      <label className="field-label">{label || "Pattern"}</label>
      <div className="input-wrap">
        <input
          className={`input ${error ? "is-error" : ""}`}
          type="text"
          placeholder="e.g. Tunic"
          maxLength={6}
          value={inputValue}
          onChange={handleInput}
          disabled={disabled}
          autoComplete="off"
        />
        <span className="input-count">{inputValue.length}/6</span>
      </div>
      {error && (
        <div className="field-error visible">
          {error}
        </div>
      )}
    </div>
  );
}
