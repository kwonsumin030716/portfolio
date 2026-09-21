/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import BasePage from "@/components/BasePage";
import { projectData } from "@/data/projects";
import React, { useEffect, useRef, useState } from 'react';
import QueueStack from "@/app/projects/3/QueueStack";

const STRUCT_TYPE = ['queueStack', 'list', 'tree', 'hashtable', 'priority'] as const;
type structType = (typeof STRUCT_TYPE)[number];

export default function Page(){
    const data = projectData.find((item) => item.id == 3);

    const lastSentTabRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWasmLoaded, setIsWasmLoaded] = useState(false);
    const [wasmInstance, setWasmInstance] = useState<any>(null); // WASM 인스턴스 보관용

    const [tab, setTab] = useState<structType>('queueStack');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    //canvas 크기 조정
    useEffect(()=>{
        if(!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries){
                const devicePixelRatio = window.devicePixelRatio || 1;
                const width = entry.contentRect.width * devicePixelRatio;
                const height = width * (1080 / 1920);

                setDimensions({width: width, height: height});

            }
        });

        resizeObserver.observe(containerRef.current);
        return() => resizeObserver.disconnect();

    }, [wasmInstance]);

    //가로 스크롤 로직
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            container.scrollLeft += Math.round(e.deltaY);
        };
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    //탭 전환 이벤트
    useEffect(() => {
        if (!wasmInstance) return;

        const tabIndex = STRUCT_TYPE.indexOf(tab);

        // 이전에 보낸 탭 인덱스 같으면 return
        if (lastSentTabRef.current === tabIndex) return;

        // 현재 보낸 인덱스 기록
        lastSentTabRef.current = tabIndex;

        // CMake에서 내보낸 C-style 함수 호출
        if (typeof wasmInstance._changeTab === 'function') {
            wasmInstance._changeTab(tabIndex);
            console.log(`▶ C++ 엔진으로 탭 전환 신호 송신 완료 (인덱스: ${tabIndex})`);
        } else if ((window as any)._changeTab) {
            (window as any)._changeTab(tabIndex);
            console.log(`▶ 전역 C++ 탭 전환 신호 송신 완료 (인덱스: ${tabIndex})`);
        }

    }, [tab, wasmInstance]);

    //WASM 모듈 로드 및 초기화
    useEffect(() => {
        if (!canvasRef.current) return;

        let isUnmounted = false;

        const moduleConfig = {
            canvas: canvasRef.current,

            print: (text: string) => console.log('[C++ Log]: ' + text),
            printErr: (text: string) => {
                console.log(
                    `%c[WASM LOG]: ${text}`,
                    'color: #ff3333; font-weight: bold;'
                );
            },

            onRuntimeInitialized: () => {
                console.log('Emscripten WASM 모듈 런타임 준비 완료');
            }
        };

        // 전역 객체 바인딩
        (window as any).Module = moduleConfig;

        const importWasmModule = new Function("path", "return import(path)");

        importWasmModule('/wasm/dataStructure.js')
            .then((createModule: any) => {
                if (isUnmounted) return;

                const initWasm = createModule.default || createModule;

                return initWasm(moduleConfig).then((instance: any) => {
                    if (isUnmounted) return;

                    console.log("C++ main 진입점 강제 구동");

                    setWasmInstance(instance);
                    setIsWasmLoaded(true);

                    if (instance && typeof instance.callMain === 'function') {
                        instance.callMain();
                    } else if (instance && typeof instance._main === 'function') {
                        instance._main();
                    }

                    setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                    }, 100);
                });
            })
            .catch((err: any) => {
                if (err?.message?.includes('unwind') || String(err).includes('unwind')) {
                    return;
                }
                console.error('WASM 모듈 로드 중 에러 발생:', err);
            });

        return () => {
            isUnmounted = true;
            if ((window as any).Module) {
                delete (window as any).Module;
            }
        };
    }, []);

    return (
        <BasePage
            projectData={data!}
            button={<></>}
        >
            <>
                <div
                    ref={scrollContainerRef}
                    className="flex border-b border-slate-200 mb-6 whitespace-nowrap overflow-x-auto overflow-y-hidden overscroll-x-contain">
                    {STRUCT_TYPE.map((type, index) => (
                        <button
                            key={index}
                            onClick={() => setTab(type)}
                            className={`px-4 py-2 font-medium text-base transition-all -mb-px cursor-pointer ${
                                type === tab
                                    ? "border-b-2 border-[#1F41B0] text-[#1F41B0] font-semibold"
                                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {!isWasmLoaded && (
                    <div className="text-slate-500 p-2 text-sm animate-pulse">
                        🟡 C++ WebAssembly 그래픽 엔진 초기화 중...
                    </div>
                )}

                {tab === 'queueStack' && (
                    <QueueStack
                        wasm={wasmInstance}
                    />
                    )
                }


                <div
                    ref={containerRef}
                    className="relative w-full"
                >
                    <canvas
                        ref={canvasRef}
                        id="canvas"
                        width={dimensions.width}
                        height={dimensions.height}
                        className="block w-full h-full bg-white"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>

            </>
        </BasePage>
    )
}
