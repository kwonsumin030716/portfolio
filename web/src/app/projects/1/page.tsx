"use client";
import Link from 'next/link';
import Image from "next/image";
import Navbar from '@/components/Navbar';
import { projectData } from "@/data/projects";
import {useEffect, useState} from "react";

interface AccountItem {
    accNum: string;
    nickName: string;
}

export default function ProjectOnePage() {
    const data = projectData.find((item) => item.id == 1);

    const [tabs, setTabs] = useState<AccountItem[]>([]);
    const [activeTab, setActiveTab] = useState<AccountItem | null>(null);



    useEffect(() => {
        fetch("http://localhost:8080/api/tabs")
            .then((res) => {
                if (!res.ok) throw new Error("백엔드 탭 리스트 로딩 실패");
                return res.json();
            })
            .then((fetchedTabs: AccountItem[]) => {
                const totalAssetItem: AccountItem = {
                    accNum: "total",
                    nickName: "총 자산"
                };

                const combinedTabs = [totalAssetItem, ...fetchedTabs];
                setTabs(combinedTabs);

                if (combinedTabs.length > 0) {
                    setActiveTab(combinedTabs[0]);
                }
            })
            .catch((err) => console.error("데이터 연동 실패:", err));
    }, []);

    if(!data) return <div>프로젝트를 찾을 수 없습니다.</div>

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-16">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition">
                    ← 목록으로 돌아가기
                </Link>

                <article className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-blue-600 bg-blue-50">{ data?.tag }</span>
                        <span className="text-s text-slate-400 font-medium">{ data?.lang }</span>
                    </div>
                    <div className="flex justify-between items-center mb-10 w-full">
                        <h1 className="text-3xl font-extrabold text-slate-900">{ data?.title }</h1>
                        <button
                            onClick={() => {
                                // 🔄 클릭 시 스프링 부트의 /api/run API를 호출합니다.
                                fetch("http://localhost:8080/api/run")
                                    .then((res) => {
                                        if (!res.ok) throw new Error("백엔드 함수 실행 실패");
                                        return res.text();
                                    })
                                    .then((message) => {
                                        alert("업데이트 완료: " + message);
                                    })
                                    .catch((err) => {
                                        alert("오류 발생: " + err.message);
                                    });
                            }}
                            className="px-4 py-2 bg-[#1F41B0] hover:bg-[#1F41B0]/90 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                        >
                            Update
                        </button>
                    </div>

                    <div className="flex border-b border-slate-200 mb-6 whitespace-nowrap">
                        {tabs.map((account, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(account)}
                                className={`px-4 py-2 font-medium text-base transition-all -mb-px ${
                                    activeTab?.accNum === account.accNum
                                        ? "border-b-2 border-[#1F41B0] text-[#1F41B0] font-semibold" // 💡 활성화 탭 색상 변경 완료!
                                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {account.nickName}
                            </button>
                        ))}
                    </div>
                    {activeTab?.accNum ? (
                        <div className="w-full bg-white p-4 mt-6">
                            <Image
                                src={`http://localhost:8080/api/images/${activeTab.accNum}.png`}
                                alt={activeTab?.nickName || "계좌 이미지"}

                                // 💡 Next.js Image 규칙을 지키면서 가로 폭에 맞춰 세로를 무한히 늘리는 마법의 삼총사 속성입니다.
                                width={0}
                                height={0}
                                sizes="100vw"

                                // 💡 Tailwind로 가로 100%, 세로는 자동 비율로 쫙 늘려줍니다. (오타 수정 완료)
                                className="w-full h-auto object-contain"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div></div>
                    )}
                </article>
            </div>
        </div>
    );
}
