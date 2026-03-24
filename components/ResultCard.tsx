"use client";

import { useState } from "react";
import type { VanityResult } from "@/hooks/useVanityGenerator";
import { KeyModal } from "./KeyModal";

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

      <div className="action-row" id="confirm-row">
        <button className="action-btn confirm" onClick={() => setShowKey(true)}>
          I understand — show private key
        </button>
        <button className="action-btn" onClick={onReset}>Generate another</button>
      </div>

      <KeyModal 
        isOpen={showKey}
        onClose={() => setShowKey(false)}
        network={network}
        privateKey={result.private_key}
        privateKeyJson={result.private_key_json}
      />
    </div>
  );
}
