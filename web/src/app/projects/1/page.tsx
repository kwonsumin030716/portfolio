"use client";
import Link from 'next/link';
import Image from "next/image";
import { projectData } from "@/data/projects";
import {useEffect, useState} from "react";
import BasePage from "@/components/BasePage";

interface AccountItem {
    accNum: string;
    nickName: string;
}

export default function ProjectOnePage() {
    const data = projectData.find((item) => item.id == 1);

    const [tabs, setTabs] = useState<AccountItem[]>([]);
    const [activeTab, setActiveTab] = useState<AccountItem | null>(null);



    useEffect(() => {
        fetch("/api/proxy/tabs")
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
        <BasePage
            projectData={data}

            button={
                <button
                    onClick={() => {
                        fetch("/api/proxy/run", {
                            method: "GET",
                            headers: {"Authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`}
                        })
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
            }

            children={(
                <>
                    <div className="flex border-b border-slate-200 mb-6 whitespace-nowrap">
                        {tabs.map((account, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(account)}
                                className={`px-4 py-2 font-medium text-base transition-all -mb-px ${
                                    activeTab?.accNum === account.accNum
                                        ? "border-b-2 border-[#1F41B0] text-[#1F41B0] font-semibold"
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
                                src={`/api/proxy/images/${activeTab.accNum}.png`}
                                alt={activeTab?.nickName || "계좌 이미지"}

                                width={0}
                                height={0}
                                sizes="100vw"

                                className="w-full h-auto object-contain"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div></div>
                    )}
                </>
            )}
        />
    );
}
