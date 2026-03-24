"use client";

import { useState } from "react";
import type { VanityResult } from "@/hooks/useVanityGenerator";

interface ResultCardProps {
  result: VanityResult;
  network: 'evm' | 'solana';
  position: "prefix" | "suffix" | "combine";
  prefix: string;
  suffix: string;
  onReset: () => void;
}

export function ResultCard({ result, network, position, prefix, suffix, onReset }: ResultCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.private_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard write failed", err);
    }
  };

  const handleCopyJson = async () => {
    if (!result.private_key_json) return;
    try {
      await navigator.clipboard.writeText(result.private_key_json);
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard write failed", err);
    }
  };

  const renderAddress = () => {
    const fullAddr = result.address;
    const isEVM = network === 'evm';
    const offset = isEVM ? 2 : 0;
    const addrPrefix = isEVM ? '0x' : '';

    if (position === "combine") {
      const pId = offset + prefix.length;
      const sId = fullAddr.length - suffix.length;
      return (
        <>
          {addrPrefix}<span className="match">{fullAddr.slice(offset, pId)}</span>
          {fullAddr.slice(pId, sId)}
          <span className="match">{fullAddr.slice(sId)}</span>
        </>
      );
    } else if (position === "suffix") {
      const idx = fullAddr.length - suffix.length;
      return (
        <>
          {fullAddr.slice(0, idx)}
          <span className="match">{fullAddr.slice(idx)}</span>
        </>
      );
    } else {
      const idx = offset + prefix.length;
      return (
        <>
          {addrPrefix}<span className="match">{fullAddr.slice(offset, idx)}</span>
          {fullAddr.slice(idx)}
        </>
      );
    }
  };


  return (
    <div className="result" style={{ display: "block" }}>
      <div className="result-label">Generated address</div>
      <div className="result-address">
        {renderAddress()}
      </div>

      <div className="warn-box">
        <span className="warn-icon">⚠</span>
        <div className="warn-text">
          Your private key is shown once and never stored anywhere.
          Save it to a password manager before closing this page.
        </div>
      </div>

      <div className={`pk-section ${showKey ? "visible" : "hidden"}`}>
        <div className="result-label" style={{ marginBottom: "5px" }}>Private key</div>
        <div className="pk-value" style={{ fontSize: network === 'solana' ? '12px' : '14px' }}>
          {result.private_key}
        </div>
        
        {result.private_key_json && (
          <>
            <div className="result-label" style={{ marginTop: "15px", marginBottom: "5px" }}>Secret key (JSON)</div>
            <div className="pk-value" style={{ fontSize: '11px', maxHeight: '60px', overflowY: 'auto' }}>
              {result.private_key_json}
            </div>
          </>
        )}

        <div className="action-row">
          <button className="action-btn" onClick={handleCopy}>
            {copied ? "Copied" : "Copy key"}
          </button>
          {result.private_key_json && (
            <button className="action-btn" onClick={handleCopyJson}>
              {jsonCopied ? "Copied JSON" : "Copy JSON"}
            </button>
          )}
          <button className="action-btn" onClick={onReset}>Generate another</button>
        </div>
      </div>


      {!showKey && (
        <div className="action-row" id="confirm-row">
          <button className="action-btn confirm" onClick={() => setShowKey(true)}>
            I understand — show private key
          </button>
        </div>
      )}
    </div>
  );
}
