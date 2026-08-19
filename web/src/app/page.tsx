'use client';
import {useState, useRef, useEffect} from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { projectData } from '@/data/projects';

export default function Home() {

    const [inputPassword, setInputPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedStatus = sessionStorage.getItem('isPageUnlocked');
            if (savedStatus === 'true') {
                setIsUnlocked(true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const CORRECT_PASSWORD = "250920";

    const verify = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputPassword === CORRECT_PASSWORD) {
            setIsUnlocked(true);
            sessionStorage.setItem('isPageUnlocked', 'true');
        } else {
            setShowModal(true);
            setInputPassword('');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            passwordInputRef.current?.focus();
        }, 50);
    };

    if (!isUnlocked){
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white px-4 relative">
                <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold mb-2">보호된 페이지입니다</h2>
                    <p className="text-slate-400 text-sm mb-6">비밀번호를 입력하세요.</p>

                    <form onSubmit={verify} className="space-y-4">
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            autoFocus
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl focus:outline-none text-center tracking-widest text-white"
                        />
                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-medium rounded-xl transition">
                            확인
                        </button>
                    </form>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-white text-slate-800 p-6 rounded-2xl max-w-sm w-full mx-4 text-center shadow-2xl animate-fade-in">
                            <div className="text-red-500 text-3xl mb-2">⚠️</div>
                            <h3 className="text-lg font-bold mb-2">로그인 실패</h3>
                            <p className="text-slate-600 text-sm mb-6">비밀번호가 올바르지 않습니다.<br />다시 입력해 주세요.</p>
                            <button
                                onClick={handleCloseModal}
                                autoFocus
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Navbar />
            <header className="flex flex-col items-center justify-center text-center px-4 py-20">
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6">PORTFOLIO</h1>
            </header>
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <div className="flex flex-col gap-6">
                    {projectData.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center w-full">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${project.tagColor}`}>
                                    {project.tag}
                                </span>
                                <span className={"text-xs font-semibold px-2.5 py-1 rounded-md text-rose-600 bg-rose-50"}>
                                    {project.lang}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-3 mb-2">
                                {project.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {project.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}