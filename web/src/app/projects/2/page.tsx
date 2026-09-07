'use client';

import React, {useState, useRef, useEffect} from 'react';
import { projectData } from "@/data/projects";
import BasePage from "@/components/BasePage";
import Concept from "./Concept";
import CurveDescription from "./CurveDescription";
import {CURVE_TYPE} from "./constants";
import {CurveType} from "./constants";

interface Point {
    x: number;
    y: number;
}

const split = 100;


export default function CurvePage(){
    const data = projectData.find((item) => item.id == 2);

    const [curveType, setCurveType] = useState<CurveType>('interpolation');
    const [points, setPoints] = useState<Point[]>([]);
    const [dimensions, setDimensions] = useState({width: 600, height: 400});
    const [showLine, setShowLine] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const conceptRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    //자동 스크롤
    useEffect(() => {
        if (isOpen && conceptRef.current) {
            setTimeout(() => {
                if(conceptRef.current){
                    const elementTop = conceptRef.current?.getBoundingClientRect().top + window.scrollY;
                    const offset = 150;

                    window.scrollTo({
                        top: elementTop - offset,
                        behavior: 'smooth',
                    });
                }
            }, 100);
        }
    }, [isOpen]);

    //크기 조절
    useEffect(() => {
        if(!containerRef) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries){
                const {width} = entry.contentRect;
                setDimensions({
                    width: width,
                    height: 400
                });
            }
        });

        resizeObserver.observe(containerRef.current!);
    }, []);

    //캔버스 클릭 제어
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints((prev) => [...prev, {x,y}]);
    }


    //그리기
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //제어점 그리기
        points.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#1F41B0';
            ctx.fill();
        })

        //선택한 곡선에 따라 분기
        if(curveType === 'catmull rom'){
            CatmullRom(ctx, points, showLine);
        } else if(curveType === 'bspline'){
            BSpline(ctx, points, showLine);
        } else if(curveType === 'bezier'){
            Bezier(ctx, points, showLine);
        } else if(curveType === 'interpolation'){
            Interpolation(ctx, points);
        } else if(curveType === 'hermite'){
            Hermit(ctx, points, showLine);
        }
    }, [dimensions, points, showLine, curveType]);

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
            }>

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
                        htmlFor="show-points"
                        className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                    >
                        보조선 표시하기
                    </label>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex border-b border-slate-200 mb-6 whitespace-nowrap overflow-x-auto overflow-y-hidden overscroll-x-contain">
                    {CURVE_TYPE.map((type, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                setCurveType(type)
                            }
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
                <div ref={containerRef} className="w-full h-100 border">
                    <canvas
                        ref = {canvasRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        onClick={handleCanvasClick}
                        className="w-full h-100 mb-6 whitespace-nowrap"

                    />
                </div>
                <CurveDescription curveType={curveType}/>
                <div className="mt-16 mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex justify-between items-center w-full text-left font-bold text-xl text-slate-800 cursor-pointer group"
                    >
                        <span className="ml-1 group-hover:text-[#1F41B0] transition-colors">기본 개념</span>
                        <span className="text-base text-slate-400 group-hover:text-[#1F41B0] transition-colors">{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                        <div ref={conceptRef} className="animate-fade-in">
                            <Concept />
                        </div>
                    )}
                </div>

            </>
        </BasePage>
    );
}


function Interpolation(ctx: CanvasRenderingContext2D, points: Point[]) {
    if(points.length < 4) return;

    ctx.beginPath();
    for(let i=0; i<points.length-3; i += 3){
        const p = points.slice(i, i+4);

        for(let j=0; j<=split; j++){
            const u = j / split;
            const u2 = u * u;
            const u3 = u2 * u;

            const b0 = 0.5 * (2 -11*u +18*u2 -9*u3);
            const b1 = 0.5 * (18*u -45*u2 +27*u3);
            const b2 = 0.5 * (-9*u + 36*u2 -27*u3);
            const b3 = 0.5 * (2*u -9*u2 +9*u3);

            const px = b0 * p[0].x + b1 * p[1].x + b2 * p[2].x + b3 * p[3].x;
            const py = b0 * p[0].y + b1 * p[1].y + b2 * p[2].y + b3 * p[3].y;

            if(i === 0 && j === 0){
                ctx.moveTo(px, py);
            }else{
                ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();
}

function Hermit(ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) {
    if(points.length < 4) return;

    ctx.beginPath();
    for(let i=0; i<points.length-3; i += 2){
        const p = points.slice(i, i+4);

        for(let j=0; j<=split; j++){
            const u = j / split;
            const u2 = u * u;
            const u3 = u2 * u;

            const b0 = 1 -u -u2 +u3;
            const b1 = u -2*u2 +u3;
            const b2 = 4*u2 -3*u3;
            const b3 = -u2 +u3;

            const px = b0 * p[0].x + b1 * p[1].x + b2 * p[2].x + b3 * p[3].x;
            const py = b0 * p[0].y + b1 * p[1].y + b2 * p[2].y + b3 * p[3].y;

            if(i === 0 && j === 0){
                ctx.moveTo(px, py);
            }else{
                ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();

    if(showLine){
        ctx.save();
        ctx.beginPath();
        for(let i=0; i<points.length - 1; i += 2){
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i+1].x, points[i+1].y);
        }
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
    }
}

function Bezier(ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) {
    if(points.length < 4) return;

    ctx.beginPath();
    for(let i=0; i<points.length-3; i += 3){
        const p = points.slice(i, i+4);

        for(let j=0; j<=split; j++){
            const u = j / split;
            const u2 = u * u;
            const u3 = u2 * u;

            const b0 = 1 -3*u +3*u2 -u3;
            const b1 = 3*u -6*u2 +3*u3;
            const b2 = 3*u2 -3*u3;
            const b3 = u3;

            const px = b0 * p[0].x + b1 * p[1].x + b2 * p[2].x + b3 * p[3].x;
            const py = b0 * p[0].y + b1 * p[1].y + b2 * p[2].y + b3 * p[3].y;

            if(i === 0 && j === 0){
                ctx.moveTo(px, py);
            }else{
                ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();

    if(showLine){
        const color: string[] = [
            "rgba(255, 65, 84, 0.85)",
            "rgba(255, 212, 38, 0.90)",
            "rgba(34, 211, 142, 0.95)"
        ];

        ctx.save();
        for(let i=0; i<points.length - 3; i += 3){
            let current = points.slice(i, i+4);
            for(let j = 0; j<3; j++){
                ctx.strokeStyle = color[j];
                ctx.beginPath();

                for (let k = 0; k < current.length; k++) {
                    if (k === 0) {
                        ctx.moveTo(current[k].x, current[k].y);
                    } else {
                        ctx.lineTo(current[k].x, current[k].y);
                    }
                }
                ctx.stroke();

                const nextPoints: Point[] = [];

                for(let k=0; k<3-j; k++){
                    const pair = current.slice(k, k+2);
                    const x = pair.reduce((acc, cur: Point) => acc + cur.x, 0) / 2;
                    const y = pair.reduce((acc, cur: Point) => acc + cur.y, 0) / 2;

                    nextPoints.push({x,y});
                }
                current = nextPoints;
            }
        }

        ctx.restore();
    }
}

function BSpline(ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) {
    if(points.length < 4) return;

    ctx.beginPath();
    for(let i=0; i<points.length-3; i++){
        const p = points.slice(i, i+4);

        for(let j=0; j<=split; j++){
            const u = j / split;
            const u2 = u * u;
            const u3 = u2 * u;

            const b0 = (1-u)*(1-u)*(1-u)/6;
            const b1 = (4 -6*u2 +3*u3)/6;
            const b2 = (1 +3*u +3*u2 -3*u3)/6;
            const b3 = u3/6;

            const px = b0 * p[0].x + b1 * p[1].x + b2 * p[2].x + b3 * p[3].x;
            const py = b0 * p[0].y + b1 * p[1].y + b2 * p[2].y + b3 * p[3].y;

            if(i === 0 && j === 0){
                ctx.moveTo(px, py);
            }else{
                ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();

    if(showLine){
        if(points.length > 1){
            ctx.save();
            ctx.strokeStyle = "#1F41B0";
            for(let i=0;i<points.length;i++){
                if(i === 0) ctx.moveTo(points[i].x, points[i].y);
                else ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            ctx.restore();

        }
    }
}

function CatmullRom(ctx: CanvasRenderingContext2D, points: Point[], showLine: boolean) {
    if(points.length < 4) return;

    ctx.beginPath();
    for(let i=0; i<points.length-3; i++){
        const p = points.slice(i, i+4);

        for(let j=0; j<=split; j++){
            const u = j / split;
            const u2 = u * u;
            const u3 = u2 * u;

            const b0 = (-u +2*u2 -u3)/2;
            const b1 = (2 -5*u2 +3*u3)/2;
            const b2 = (u +4*u2 -3*u3)/2;
            const b3 = (-u2 +u3)/2;

            const px = b0 * p[0].x + b1 * p[1].x + b2 * p[2].x + b3 * p[3].x;
            const py = b0 * p[0].y + b1 * p[1].y + b2 * p[2].y + b3 * p[3].y;

            if(i === 0 && j === 0){
                ctx.moveTo(px, py);
            }else{
                ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();

    if (showLine && points.length >= 4) {
        ctx.save();

        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([5,10]);

        for (let i = 0; i < points.length - 3; i++) {
            const p = points.slice(i, i+4);

            //p0-p2
            ctx.beginPath();
            ctx.moveTo(p[0].x, p[0].y);
            ctx.lineTo(p[2].x, p[2].y);
            ctx.stroke();

            //p1-p3
            ctx.beginPath();
            ctx.moveTo(p[1].x, p[1].y);
            ctx.lineTo(p[3].x, p[3].y);
            ctx.stroke();

            ctx.save();
            ctx.strokeStyle = '#1F41B0';

            //p1
            const halfT1:Point = {
                x:(p[2].x - p[0].x) / 2,
                y:(p[2].y - p[0].y) / 2
            };
            ctx.beginPath();
            ctx.moveTo(p[1].x - halfT1.x * 0.5, p[1].y - halfT1.y * 0.5);
            ctx.lineTo(p[1].x + halfT1.x * 0.5, p[1].y + halfT1.y * 0.5);
            ctx.stroke();

            //p2
            const halfT2:Point = {
                x: (p[3].x - p[1].x) / 2,
                y: (p[3].y - p[1].y) / 2,
            }
            ctx.beginPath();
            ctx.moveTo(p[2].x - halfT2.x * 0.5, p[2].y - halfT2.y * 0.5);
            ctx.lineTo(p[2].x + halfT2.x * 0.5, p[2].y + halfT2.y * 0.5);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }
}