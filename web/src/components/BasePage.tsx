import React from 'react';
import {projectData} from '../data/projects';
import Navbar from "@/components/Navbar";
import Link from "next/link";



export default function BasePage({
    projectData: data,
    button,
    children
    }:{
    projectData: (typeof projectData)[number];
    button: React.ReactNode;
    children:React.ReactNode;
}){
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
                        {button}
                    </div>
                    {children}
                </article>
            </div>
        </div>
    )
}