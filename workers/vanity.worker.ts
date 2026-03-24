self.onmessage = async (event: MessageEvent) => {
  const { prefix, suffix, position, network } = event.data;
  
  try {
    const wasmPath = network === 'solana' ? '/wasm/solana-engine/engine.js' : '/wasm/evm-engine/engine.js';
    const wasmBgPath = network === 'solana' ? '/wasm/solana-engine/engine_bg.wasm' : '/wasm/evm-engine/engine_bg.wasm';


    // @ts-ignore - The WASM file is dynamically served and not available at type-check time
    const wasmModule = await import(/* webpackIgnore: true */ `${self.location.origin}${wasmPath}`);
    const { default: init, generate_vanity } = wasmModule;
    
    await init(`${self.location.origin}${wasmBgPath}`);
    
    const jsonResult = generate_vanity(prefix, suffix, position);
    const result = JSON.parse(jsonResult);
    
    self.postMessage({ type: "DONE", result });
  } catch (err: any) {
    self.postMessage({ 
      type: "ERROR", 
      error: err.message || "Failed to load WASM. Ensure you ran wasm-pack build." 
    });
  }
};

