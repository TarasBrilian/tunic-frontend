"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  network: 'evm' | 'solana';
  privateKey: string;
  privateKeyJson?: string;
}

export function KeyModal({ isOpen, onClose, network, privateKey, privateKeyJson }: KeyModalProps) {
  const [copied, setCopied] = useState<'pk' | 'json' | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, type: 'pk' | 'json') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#161512]/5 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="card relative w-full max-w-[440px] shadow-[0_24px_54px_-12px_rgba(22,21,18,0.18)] animate-in zoom-in-95 fade-in duration-300">

        <div className="card-title">Security Credentials</div>
        <div className="card-sub">Private keys are shown once and never stored</div>

        <div className="space-y-6 my-8">
          {/* Main Private Key */}
          <div className="field">
            <div className="flex justify-between items-center mb-1.5">
              <label className="field-label mb-0">Private Key</label>
              <button
                onClick={() => handleCopy(privateKey, 'pk')}
                className="text-[10px] cursor-pointer uppercase font-bold tracking-widest text-[#2D5A3D] hover:underline"
              >
                {copied === 'pk' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="pk-value select-all leading-relaxed bg-[#F8F6F1]/50">
              {privateKey}
            </div>
          </div>

          {/* Solana JSON Key */}
          {network === 'solana' && privateKeyJson && (
            <div className="field">
              <div className="flex justify-between items-center mb-1.5">
                <label className="field-label mb-0">Secret Key (JSON)</label>
                <button
                  onClick={() => handleCopy(privateKeyJson, 'json')}
                  className="text-[10px] uppercase font-bold tracking-widest text-[#2D5A3D] hover:underline"
                >
                  {copied === 'json' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="pk-value select-all leading-relaxed bg-[#F8F6F1]/50 max-h-[100px] overflow-y-auto scrollbar-hide text-[9px]">
                {privateKeyJson}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="compute-btn"
        >
          <span className="btn-text">
            I have saved these safely <span className="btn-arrow">→</span>
          </span>
        </button>

        <Link className="footer" target="_blank" href="https://etherscan.io/address/0x283A1a858Cea7B0e27c0EfA05957c8138E632003">
          <span className="footer-note">donation: 0x283A1a858Cea7B0e27c0EfA05957c8138E632003 ❤️ </span>
        </Link>
      </div>
    </div>
  );
}
