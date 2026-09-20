// src/types/wasm.d.ts
import "@types/emscripten";

declare global {
    interface EmscriptenModule {
        ccall?: (
            funcName: string,
            returnType: string | null,
            argTypes: string[],
            args: unknown[]
        ) => unknown;
    }
}
