"use client";
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
                        // 1. [핵심] 백엔드에 요청을 보냅니다 (결과를 기다리지 않고 바로 다음 줄로 넘어감)
                        fetch("/api/proxy/run", {
                            method: "GET",
                            headers: {"Authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`}
                        })
                            .then((res) => {
                                // (선택 사항) 만약 뒤늦게라도 서버가 에러를 뱉었는지 콘솔로만 기록해두고 싶다면 남겨둡니다.
                                if (!res.ok) console.error("백엔드 비동기 처리 중 서버 에러 발생");
                            })
                            .catch((err) => {
                                console.error("백엔드 통신 자체 실패:", err);
                            });

                        // 2. [핵심] fetch의 완료 여부와 관계없이 누르는 즉시 사용자에게 알림을 띄웁니다.
                        alert("업데이트 요청 완료 (5~10분 소요)");
                    }}
                    className="px-4 py-2 bg-[#1F41B0] hover:bg-[#1F41B0]/90 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                >
                    Update
                </button>
            }
        >
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
        </BasePage>
    );
}
