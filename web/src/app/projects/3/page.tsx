'use client';
import BasePage from "@/components/BasePage";
import {projectData} from "@/data/projects";
import React, {useEffect, useRef, useState} from 'react';

export default function Page(){
    const data = projectData.find((item) => item.id == 3);

    const STRUCT_TYPE = ['queueStack', 'list', 'tree', 'hashtable', 'priority'] as const;
    type structType = (typeof STRUCT_TYPE)[number];

    const [tab, setTab] = useState<structType>('queueStack');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    //가로 스크롤
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
                            onClick={() =>
                                setTab(type)
                            }
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
            </>
        </BasePage>
    )
}