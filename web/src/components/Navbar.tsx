// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 text-slate-800 w-full shadow-sm">
            <Link href="/" className="text-xl font-bold text-slate-800">
                kwonsum.in
            </Link>

            {/* 우측 메뉴 영역만 깔끔하게 남겨둡니다 */}
            <div className="space-x-6 text-sm font-medium text-slate-600">
                <Link href="/" className="hover:text-blue-600 transition">홈</Link>
                <a href="#" className="hover:text-blue-600 transition">소개</a>
                <a href="#" className="hover:text-blue-600 transition">방명록</a>
            </div>
        </nav>
    );
}
