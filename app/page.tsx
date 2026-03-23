"use client";

import { useState } from "react";
import { useVanityGenerator } from "@/hooks/useVanityGenerator";
import { LeetspeakPicker } from "@/components/LeetspeakPicker";
import { ResultCard } from "@/components/ResultCard";
import Link from "next/link";

export default function Home() {
  const [position, setPosition] = useState<"prefix" | "suffix" | "combine">("suffix");
  const [prefixVariant, setPrefixVariant] = useState<string | null>(null);
  const [suffixVariant, setSuffixVariant] = useState<string | null>(null);

  const { state, result, error, startGeneration, reset } = useVanityGenerator();

  const handleGenerate = () => {
    startGeneration(prefixVariant || "", suffixVariant || "", position);
  };

  const handleReset = () => {
    reset();
    setPrefixVariant(null);
    setSuffixVariant(null);
  };

  const isBusy = state === "generating";
  const isReady = position === "combine"
    ? (!!prefixVariant || !!suffixVariant)
    : (position === "prefix" ? !!prefixVariant : !!suffixVariant);
  const activePattern = position === "prefix" ? (prefixVariant || "") : (suffixVariant || "");

  return (
    <div className="page">
      <div className="wordmark">
        tunic
        <span className="wordmark-dot"></span>
        beautiful addresses, made for you
      </div>

      <div className="card">
        <div className="card-title">Generate your address</div>
        <div className="card-sub">Vanity EVM address generator</div>

        {error && (
          <div className="warn-box" style={{ borderColor: 'var(--danger)', background: '#FDF0EF', marginBottom: '1.25rem' }}>
            <span className="warn-icon" style={{ color: 'var(--danger)' }}>⚠</span>
            <div className="warn-text" style={{ color: 'var(--danger)' }}>{error}</div>
          </div>
        )}

        <div>
          {position === "combine" ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <LeetspeakPicker
                label="Prefix"
                variant={prefixVariant}
                onChange={setPrefixVariant}
                disabled={isBusy}
                position="prefix"
              />
              <LeetspeakPicker
                label="Suffix"
                variant={suffixVariant}
                onChange={setSuffixVariant}
                disabled={isBusy}
                position="suffix"
              />
            </div>
          ) : (
            <LeetspeakPicker
              variant={position === "prefix" ? prefixVariant : suffixVariant}
              onChange={position === "prefix" ? setPrefixVariant : setSuffixVariant}
              disabled={isBusy}
              position={position}
            />
          )}
        </div>

        {(prefixVariant || suffixVariant) && (
          <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div className="field-label">Target pattern</div>
            <div style={{
              fontSize: '15px',
              fontFamily: 'var(--mono)',
              color: 'var(--ink-2)',
              letterSpacing: '0.03em',
              padding: '4px 0'
            }}>
              {position === "combine" ? (
                <>
                  0x<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{prefixVariant || "..."}</span>
                  ...
                  <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{suffixVariant || "..."}</span>
                </>
              ) : position === "prefix" ? (
                <>
                  0x<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{prefixVariant}</span>...
                </>
              ) : (
                <>
                  0x...<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{suffixVariant}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="position-row">
          <button
            className={`pos-btn ${position === "suffix" ? "active" : ""}`}
            onClick={() => setPosition("suffix")}
            disabled={isBusy}
            title="Suffix = pattern at the end of the address ex: 0x...123"
          >
            suffix
          </button>
          <button
            className={`pos-btn ${position === "prefix" ? "active" : ""}`}
            onClick={() => setPosition("prefix")}
            disabled={isBusy}
            title="Prefix = pattern at the front of the address ex: 0x123..."
          >
            prefix
          </button>
          <button
            className={`pos-btn ${position === "combine" ? "active" : ""}`}
            onClick={() => setPosition("combine")}
            disabled={isBusy}
            title="Combine = starts and ends with pattern ex: 0x123...123"
          >
            combine
          </button>
        </div>

        {position === "combine" && ((prefixVariant?.length || 0) + (suffixVariant?.length || 0)) >= 4 && (
          <div className="warn-box" style={{ marginBottom: '1.25rem' }}>
            <span className="warn-icon">⚠</span>
            <div className="warn-text">
              Combine mode doubles the pattern length requirement. Generation may take significantly longer.
            </div>
          </div>
        )}

        <button
          className="compute-btn"
          disabled={!isReady || isBusy}
          onClick={handleGenerate}
        >
          <span className="btn-text" style={{ display: isBusy ? "none" : "flex" }}>
            Compute <span className="btn-arrow">→</span>
          </span>
          <span className="btn-loading" style={{ display: isBusy ? "flex" : "none" }}>
            <span className="dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            Computing
          </span>
        </button>

        {state === "done" && result && (
          <ResultCard
            result={result}
            position={position}
            prefix={prefixVariant || ""}
            suffix={suffixVariant || ""}
            onReset={handleReset}
          />
        )}
      </div>

      <div className="footer">
        all operations run in your browser &nbsp;·&nbsp; no data leaves your device
      </div>
      <Link className="footer" target="_blank" href="https://etherscan.io/address/0x283A1a858Cea7B0e27c0EfA05957c8138E632003">
        <span className="footer-note">donation: 0x283A1a858Cea7B0e27c0EfA05957c8138E632003 ❤️ </span>
      </Link>
    </div>
  );
}
