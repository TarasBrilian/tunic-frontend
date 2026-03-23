"use client";

import { useState, useRef, useCallback } from "react";

export type GenerationState = "idle" | "generating" | "done" | "error";

export interface VanityResult {
  private_key: string;
  address: string;
}

export function useVanityGenerator() {
  const [state, setState] = useState<GenerationState>("idle");
  const [result, setResult] = useState<VanityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workersRef = useRef<Worker[]>([]);

  const terminateAll = useCallback(() => {
    workersRef.current.forEach((w) => w.terminate());
    workersRef.current = [];
  }, []);

  const startGeneration = useCallback((prefix: string, suffix: string, position: "prefix" | "suffix" | "combine") => {
    terminateAll();
    setState("generating");
    setResult(null);
    setError(null);

    const workerCount = Math.min(navigator.hardwareConcurrency || 4, 8);
    let failedCount = 0;
    const newWorkers: Worker[] = [];

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(new URL("../workers/vanity.worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (event) => {
        const { type, result: wResult, error: wError } = event.data;
        if (type === "DONE") {
          setResult(wResult);
          setState("done");
          terminateAll();
        } else if (type === "ERROR") {
          failedCount++;
          worker.terminate();
          if (failedCount === workerCount) {
            setError(wError);
            setState("error");
            terminateAll();
          }
        }
      };

      worker.onerror = (err) => {
        failedCount++;
        worker.terminate();
        if (failedCount === workerCount) {
          setError(err.message || "Unknown worker error occurred");
          setState("error");
          terminateAll();
        }
      };

      worker.postMessage({ prefix, suffix, position });
      newWorkers.push(worker);
    }

    workersRef.current = newWorkers;
  }, [terminateAll]);

  const reset = useCallback(() => {
    terminateAll();
    setState("idle");
    setResult(null);
    setError(null);
  }, [terminateAll]);

  return { state, result, error, startGeneration, reset };
}
