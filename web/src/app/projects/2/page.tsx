'use client';

import React, {useState, useRef, useEffect} from 'react';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { projectData } from "@/data/projects";

interface Point {
    x: number;
    y: number;
}

type CurveType = 'bezier' | 'bspline' | 'hermite';

export default function CurvePage(){
    const data = projectData.find((item) => item.id == 2);

    const [curveType, setCurveType] = useState<CurveType>('bezier');
    const [points, setPoints] = useState<Point[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        draw();
    }, [points, curveType]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    }

    const handleClear = () => {
        setPoints([]);
    }

    const draw = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.clearRect(0,0,canvas.width, canvas.height);

        ctx.fillStyle = '#ff4757';
        points.forEach((p, index) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#333';
            ctx.font = '12px sans-serif';
            ctx.fillText(`P${index}`, p.x + 8, p.y -8);
            ctx.fillStyle = '#ff4757';
        });

        if(points.length < 2) return;

        ctx.lineWidth = 2;

        if(curveType === 'bezier'){
            ctx.strokeStyle = '#1e90ff';
            drawBezier(ctx, points);
        }else if(curveType === 'bspline'){
            ctx.strokeStyle = '#2ed573';
            drawBSpline(ctx, points);
        }else if(curveType === 'hermite'){
            ctx.strokeStyle = '#9b59b6';
            drawHermite(ctx, points);
        }
    };

    const drawBezier = (ctx: CanvasRenderingContext2D, pts: Point[]) => {

    }
    const drawBSpline = (ctx: CanvasRenderingContext2D, pts: Point[]) => {

    }
    const drawHermite = (ctx: CanvasRenderingContext2D, pts: Point[]) => {

    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Navbar />
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

                    <div style={{ margin: '15px', padding: '10px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {(['bezier', 'bspline', 'hermite'] as CurveType[]).map((type) => (
                            <label key={type} style={{ marginRight: '15px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize' }}>
                                <input
                                    type="radio"
                                    name="curveType"
                                    value={type}
                                    checked={curveType === type}
                                    onChange={(e) => setCurveType(e.target.value as CurveType)}
                                    style={{ marginRight: '5px' }}
                                />
                                {type === 'bspline' ? 'B-Spline' : type}
                            </label>
                        ))}
                        <button
                            onClick={handleClear}
                            style={{ padding: '6px 12px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            점 초기화
                        </button>
                    </div>

                    {/* 캔버스 영역 */}
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={500}
                        onClick={handleCanvasClick}
                        style={{ background: 'white', border: '2px solid #333', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'crosshair' }}
                    />
                </div>
            </article>
        </div>
    );
}