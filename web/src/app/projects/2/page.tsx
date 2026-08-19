'use client';


import React, {useState, useRef, useEffect} from 'react';
import Link from "next/link";
import { projectData } from "@/data/projects";
import BasePage from "@/components/BasePage";

interface Point {
    x: number;
    y: number;
}

const CURVE_TYPE = ['hermite', 'bezier', 'bspline']  as const;
type CurveType = (typeof CURVE_TYPE)[number];

export default function CurvePage(){
    const data = projectData.find((item) => item.id == 2);


    const [curveType, setCurveType] = useState<CurveType>('hermite');
    const [points, setPoints] = useState<Point[]>([]);
    const [dimensions, setDimensions] = useState({width: 600, height: 400});
    const [showLine, setShowLine] = useState<boolean>(true);


    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //크기 조절
    useEffect(() => {
        if(!containerRef) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for(let entry of entries){
                const {width} = entry.contentRect;
                setDimensions({
                    width: width,
                    height: 400
                });
            }
        });

        resizeObserver.observe(containerRef.current!);
    }, []);

    //그리기
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1;

        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        points.forEach((point, index) => {
            ctx.fillStyle = index === 0 ? '#ef4444' : '#1f41b0';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        drawLine(ctx, points, showLine);
    }, [dimensions, points, showLine]);

    //캔버스 클릭 제어
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints((prev) => [...prev, {x,y}]);
    }

    const drawLine = (ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) => {
        if(curveType === 'hermite'){
            drawHermite(ctx, points, showLine);
        }else if(curveType === 'bezier'){
            drawBezier(ctx, points, showLine);
        }else if(curveType === 'bspline'){
            drawBSpline(ctx, points, showLine);
        }
    }

    const drawHermite = (ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) => {
        if(points.length < 4) return;

        ctx.strokeStyle = '#1F41B0';
        ctx.lineWidth = 3;
        ctx.beginPath();

        for(let i=0; i<points.length -3; i += 2){
            const p00 = points[i];
            const p01 = points[i+1];
            const p10 = points[i+2];
            const p11 = points[i+3];

            const a0 = {x: (p01.x - p00.x), y: (p01.y - p00.y)};
            const a1 = {x: (p11.x - p10.x), y: (p11.y - p10.y)};

            for(let t = 0; t <= 1; t += 0.02){
                const t2 = t * t;
                const t3 = t2 * t;

                const h00 = 2 * t3 - 3 * t2 + 1;
                const h01 = - 2 * t3 + 3 * t2;
                const h10 = t3 - 2 * t2 + t;
                const h11 = t3 - t2;

                const x = h00 * p00.x + h01 * p10.x + h10 * a0.x + h11 * a1.x;
                const y = h00 * p00.y + h01 * p10.y + h10 * a0.y + h11 * a1.y;

                if(t === 0 && i === 0){
                    ctx.moveTo(x,y);
                }else{
                    ctx.lineTo(x,y);
                }
            }
        }
        ctx.stroke();

        if (showLine) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);

            for (let i = 0; i < points.length - 1; i += 2) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[i + 1].x, points[i + 1].y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
    };

    const drawBezier = (ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) => {

    }
    const drawBSpline = (ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) => {

    }


    return (
        <BasePage
            projectData={data!}

            button={
                <button
                    onClick={() => {
                        setPoints([]);
                    }}
                    className="px-4 py-2 bg-[#1F41B0] hover:bg-[#1F41B0]/90 text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                >
                    Reset
                </button>
            }

            children={(
                <>
                    <div className="flex items-center gap-2 mb-6">
                        <input
                            type="checkbox"
                            id="show-points"
                            checked={showLine}
                            onChange={(e) => setShowLine(e.target.checked)}
                            className="w-4 h-4 text-[#1F41B0] border-slate-300 rounded focus:ring-[#1F41B0] cursor-pointer"
                        />
                        <label
                            htmlFor="show-line"
                            className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                        >
                            보조선 표시하기
                        </label>
                    </div>

                    <div className="flex border-b border-slate-200 mb-6 whitespace-nowrap">
                        {CURVE_TYPE.map((type, index) => (
                            <button
                                key={index}
                                onClick={() => setCurveType(type)}
                                className={`px-4 py-2 font-medium text-base transition-all -mb-px cursor-pointer ${
                                    type === curveType
                                        ? "border-b-2 border-[#1F41B0] text-[#1F41B0] font-semibold"
                                        : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div ref={containerRef} className="w-full border">
                        <canvas
                            ref = {canvasRef}
                            width={dimensions.width}
                            height={dimensions.height}
                            onClick={handleCanvasClick}
                            className="w-full h-[400px] mb-6 whitespace-nowrap"

                        />
                    </div>

                </>
            )}
        />
    );
}