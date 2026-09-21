import {useState} from "react";

interface QueueStackProps {
    wasm: EmscriptenModule | null | undefined;
}


export default function QueueStack({wasm}: QueueStackProps) {

    const [inputText, setInputText] = useState<string>('');
    const handlePush = () => {
        if (!inputText.trim()) return;

        if (wasm && typeof wasm.ccall === "function") {
            wasm.ccall("queueStackPush", null, ["string"], [inputText]);
            setInputText("");
        }
    };

    const handlePop = () => {
        if(wasm && typeof wasm.ccall === "function"){
            wasm.ccall("queueStackPop", null, [], []);
        }
    }

    return (
        <div
            className="flex h-12 gap-2"
        >
            <input
                value={inputText}
                className="h-full border-2 w-24 px-2 rounded-lg"
                type="text"
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}

            />
            <button
                className="bg-[#1F41B0] text-white text-lg p-3 rounded-lg font-bold"
                onClick={handlePush}
            >
                PUSH
            </button>
            <button
                className="bg-[#1F41B0] text-white text-lg p-3 rounded-lg font-bold"
                onClick={handlePop}
            >
                POP
            </button>

        </div>
    )
}