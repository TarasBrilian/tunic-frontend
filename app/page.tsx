"use client";

import { useState } from "react";
import { useVanityGenerator } from "@/hooks/useVanityGenerator";
import { LeetspeakPicker } from "@/components/LeetspeakPicker";
import { Base58Input } from "@/components/Base58Input";
import { ResultCard } from "@/components/ResultCard";

import Link from "next/link";

export default function Home() {
  const [network, setNetwork] = useState<'evm' | 'solana'>('evm');
  const [position, setPosition] = useState<"prefix" | "suffix" | "combine">("prefix");
  const [prefixVariant, setPrefixVariant] = useState<string | null>(null);
  const [suffixVariant, setSuffixVariant] = useState<string | null>(null);

  const { state, result, error, startGeneration, reset } = useVanityGenerator();

  const handleGenerate = () => {
    startGeneration(prefixVariant || "", suffixVariant || "", position, network);
  };

  const handleReset = () => {
    reset();
    setPrefixVariant(null);
    setSuffixVariant(null);
  };

  const switchNetwork = (net: 'evm' | 'solana') => {
    if (isBusy) return;
    setNetwork(net);
    handleReset();
  };

  const isBusy = state === "generating";
  const isReady = position === "combine"
    ? (!!prefixVariant || !!suffixVariant)
    : (position === "prefix" ? !!prefixVariant : !!suffixVariant);

  const addrPrefix = network === 'evm' ? '0x' : '';

  return (
    <div className="page">
      <div className="wordmark">
        tunic
        <span className="wordmark-dot"></span>
        beautiful addresses, made for you
      </div>

      <div className="network-select">
        <button
          className={`net-btn ${network === 'evm' ? 'active' : ''}`}
          onClick={() => switchNetwork('evm')}
          disabled={isBusy}
        >
          EVM
        </button>
        <button
          className={`net-btn ${network === 'solana' ? 'active' : ''}`}
          onClick={() => switchNetwork('solana')}
          disabled={isBusy}
        >
          Solana
        </button>
      </div>

      <div className="card">
        <div className="card-title">Generate your address</div>
        <div className="card-sub">Vanity {network.toUpperCase()} address generator</div>

        {error && (
          <div className="warn-box" style={{ borderColor: 'var(--danger)', background: '#FDF0EF', marginBottom: '1.25rem' }}>
            <span className="warn-icon" style={{ color: 'var(--danger)' }}>⚠</span>
            <div className="warn-text" style={{ color: 'var(--danger)' }}>{error}</div>
          </div>
        )}

        <div>
          {position === "combine" ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {network === 'evm' ? (
                <>
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
                </>
              ) : (
                <>
                  <Base58Input
                    label="Prefix"
                    value={prefixVariant}
                    onChange={setPrefixVariant}
                    disabled={isBusy}
                  />
                  <Base58Input
                    label="Suffix"
                    value={suffixVariant}
                    onChange={setSuffixVariant}
                    disabled={isBusy}
                  />
                </>
              )}
            </div>
          ) : (
            network === 'evm' ? (
              <LeetspeakPicker
                variant={position === "prefix" ? prefixVariant : suffixVariant}
                onChange={position === "prefix" ? setPrefixVariant : setSuffixVariant}
                disabled={isBusy}
                position={position}
              />
            ) : (
              <Base58Input
                label={position.charAt(0).toUpperCase() + position.slice(1)}
                value={position === "prefix" ? prefixVariant : suffixVariant}
                onChange={position === "prefix" ? setPrefixVariant : setSuffixVariant}
                disabled={isBusy}
              />
            )
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
                  {addrPrefix}<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{prefixVariant || "..."}</span>
                  ...
                  <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{suffixVariant || "..."}</span>
                </>
              ) : position === "prefix" ? (
                <>
                  {addrPrefix}<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{prefixVariant}</span>...
                </>
              ) : (
                <>
                  {addrPrefix}...<span style={{ color: 'var(--accent)', fontWeight: 500 }}>{suffixVariant}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="position-row">
          <button
            className={`pos-btn ${position === "prefix" ? "active" : ""}`}
            onClick={() => setPosition("prefix")}
            disabled={isBusy}
            title="Prefix = pattern at the front of the address"
          >
            prefix
          </button>
          <button
            className={`pos-btn ${position === "suffix" ? "active" : ""}`}
            onClick={() => setPosition("suffix")}
            disabled={isBusy}
            title="Suffix = pattern at the end of the address"
          >
            suffix
          </button>
          <button
            className={`pos-btn ${position === "combine" ? "active" : ""}`}
            onClick={() => setPosition("combine")}
            disabled={isBusy}
            title="Combine = starts and ends with pattern"
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
            network={network}
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

