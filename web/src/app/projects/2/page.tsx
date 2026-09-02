'use client';

import React, {useState, useRef, useEffect} from 'react';
import Link from "next/link";
import { projectData } from "@/data/projects";
import BasePage from "@/components/BasePage";
import Concept from "./Concept";
import CurveDescription from "./CurveDescription";

interface Point {
    x: number;
    y: number;
}

export const CURVE_TYPE = ['interpolation', 'hermite', 'bezier', 'bspline', 'catmull rom']  as const;
export type CurveType = (typeof CURVE_TYPE)[number];

const M_INTERPOLATION = [
    [   1,     0,     0,    0],
    [-5.5,     9,  -4.5,    1],
    [   9, -22.5,    18, -4.5],
    [-4.5,  13.5, -13.5,  4.5]
];

const M_HERMITE: number[][] = [
    [ 1,  0,  0,  0],
    [ 0,  0,  1,  0],
    [-3,  3, -2, -1],
    [ 2, -2, 1,  1]
];

const M_BEZIER: number[][] = [
    [ 1,  0,  0, 0],
    [-3,  3,  0, 0],
    [ 3, -6,  3, 0],
    [-1,  3, -3, 1]
];

const M_B_SPLINE: number[][] = [
    [ 1/6,  4/6,  1/6,  0],
    [-3/6,  0/6,  3/6,  0],
    [ 3/6, -6/6,  3/6,  0],
    [-1/6,  3/6, -3/6, 1/6]
];

const M_CATMULL_ROM: number[][] = [
    [ 0,    1,    0,    0  ],
    [-0.5,  0,    0.5,  0  ],
    [ 1,   -2.5,  2,   -0.5],
    [-0.5,  1.5, -1.5,  0.5]
];

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

    const split = 100;

    //자동 스크롤
    useEffect(() => {
        if (isOpen && conceptRef.current) {
            setTimeout(() => {
                const elementTop = conceptRef.current?.getBoundingClientRect().top + window.scrollY;

                const offset = 150;

                window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth',
                });
            }, 100);
        }
    }, [isOpen]);

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

        //화면 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //제어점 그리기
        points.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#1F41B0';
            ctx.fill();
        })

        //선택한 곡선에 따라 분기
        if(curveType === 'catmull rom'){
            drawSlide(M_CATMULL_ROM, points, ctx);
        } else if(curveType === 'bspline'){
            drawSlide(M_B_SPLINE, points, ctx);
        } else if(curveType === 'bezier'){
            drawConnect(M_BEZIER, points, ctx);
        } else if(curveType === 'interpolation'){
            drawConnect(M_INTERPOLATION, points, ctx);
        } else if(curveType === 'hermite'){
            drawHermit(points, ctx);
        }



    }, [dimensions, points, showLine, curveType]);

    const drawSlide = (M: number[][], points:Point[], ctx: CanvasRenderingContext2D) => {
        if(points.length >= 4){
            ctx.beginPath();
            for(let i=0; i<points.length-3; i++){
                const current = points.slice(i, i+4);

            const c = getC(M, current);

                for(let u=0; u <= split; u++){
                    const p = getPu(u/split, c);
                    if(i === 0 && u === 0){
                        ctx.moveTo(p.x, p.y);
                    }else{
                        ctx.lineTo(p.x, p.y);
                    }
                }
            }
            ctx.stroke();
        }

        if(showLine){
            if(M === M_B_SPLINE && points.length > 1){
                ctx.save();
                ctx.strokeStyle = "#1F41B0";
                for(let i=0;i<points.length;i++){
                    if(i === 0) ctx.moveTo(points[i].x, points[i].y);
                    else ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
                ctx.restore();

            }
            if (curveType === 'catmull rom' && points.length >= 4) {
                ctx.save();

                // 보조선 스타일 (투명한 회색 점선)
                ctx.strokeStyle = "rgba(170, 170, 170, 0.8)";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([5,5]);

                for (let i = 0; i < points.length - 3; i++) {
                    const p0 = points[i];
                    const p1 = points[i + 1]; // 곡선 조각의 시작점
                    const p2 = points[i + 2]; // 곡선 조각의 끝점
                    const p3 = points[i + 3];

                    // ------------------------------------------------------------------
                    // 1. P0에서 P2로 향하는 오리지널 가이드 뼈대선 그리기
                    // ------------------------------------------------------------------
                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();

                    // ------------------------------------------------------------------
                    // 2. 시작점 P1에서의 접선 벡터 (P2 - P0) / 2 계산 및 시각화
                    // ------------------------------------------------------------------
                    // 벡터 계산 (P2 - P0)
                    const t1X = p2.x - p0.x;
                    const t1Y = p2.y - p0.y;

                    // 공식 그대로 딱 절반(/2) 크기의 벡터로 만듭니다.
                    const halfT1X = t1X / 2;
                    const halfT1Y = t1Y / 2;

                    // 이 절반 크기의 벡터를 시작점 P1을 중심으로 앞뒤로 뻗어나가게 그립니다.
                    ctx.beginPath();
                    ctx.moveTo(p1.x - halfT1X * 0.5, p1.y - halfT1Y * 0.5);
                    ctx.lineTo(p1.x + halfT1X * 0.5, p1.y + halfT1Y * 0.5);

                    // 접선임을 강조하기 위해 색상을 살짝 다르게 하거나 두께를 조절할 수 있습니다.
                    ctx.save();
                    ctx.strokeStyle = "rgba(30, 144, 255, 0.8)"; // 은은한 파란빛 회색
                    ctx.stroke();
                    ctx.restore();


                    // ------------------------------------------------------------------
                    // 3. (선택 사항) 끝점 P2에서의 접선 벡터 (P3 - P1) / 2 도 똑같이 시각화
                    // ------------------------------------------------------------------
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.stroke();

                    const t2X = p3.x - p1.x;
                    const t2Y = p3.y - p1.y;
                    const halfT2X = t2X / 2;
                    const halfT2Y = t2Y / 2;

                    ctx.beginPath();
                    ctx.moveTo(p2.x - halfT2X * 0.5, p2.y - halfT2Y * 0.5);
                    ctx.lineTo(p2.x + halfT2X * 0.5, p2.y + halfT2Y * 0.5);
                    ctx.save();
                    ctx.strokeStyle = "rgba(30, 144, 255, 0.6)";
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.restore();
            }
        }
    }

    const drawConnect = (M: number[][], points: Point[], ctx: CanvasRenderingContext2D) => {
        if(points.length < 4) return;

        ctx.beginPath();
        for(let i=0; i<points.length-3; i += 3){
            const current = points.slice(i, i+4);

                const c = getC(M, current);

            for(let u=0; u<=split; u++){
                const p = getPu(u/split, c);
                if(i === 0 && u === 0){
                    ctx.moveTo(p.x, p.y);
                }else{
                    ctx.lineTo(p.x, p.y);
                }
            }
        }
        ctx.stroke();

        if(showLine && M === M_BEZIER){
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

    const drawHermit = (points: Point[], ctx: CanvasRenderingContext2D) => {
        let current: Point[] = [];
        const split = 100;

        ctx.beginPath();
        if(points.length < 4) return;
        for(let i=0; i<points.length-3; i += 2){
            current.push(points[i]);
            current.push(points[i+2]);
            current.push({x: points[i+1].x - points[i].x, y: points[i+1].y - points[i].y});
            current.push({x: points[i+3].x - points[i+2].x, y: points[i+3].y - points[i+2].y});

            const c = getC(M_HERMITE, current);
            for(let u=0; u<=split; u++){
                const p = getPu(u/split, c);
                if(i === 0 && u === 0){
                    ctx.moveTo(p.x, p.y);
                }else{
                    ctx.lineTo(p.x, p.y);
                }
            }
            current = [];
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

    //캔버스 클릭 제어
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints((prev) => [...prev, {x,y}]);
    }

    //c = Mp
    const getC = (M: number[][], p: Point[]): Point[] => {
         const c:Point[] = [];
         for(let i=0; i<4; i++){
             let cx = 0;
             let cy = 0;
             for(let j=0; j<4; j++){
                 cx += M[i][j] * p[j].x;
                 cy += M[i][j] * p[j].y;
             }
             c.push({x: cx, y: cy});
         }
         return c;
    }

    //p(u) = uTc
    const getPu = (u: number, c: Point[]): Point => {
        let px = 0;
        let py = 0;

        let j = 1;
        for(let i=0; i<4; i++){
            px += j * c[i].x;
            py += j * c[i].y;
            j *= u;
        }

        return {x: px, y: py};
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
                    <div ref={containerRef} className="w-full h-[400px] border">
                        <canvas
                            ref = {canvasRef}
                            width={dimensions.width}
                            height={dimensions.height}
                            onClick={handleCanvasClick}
                            className="w-full h-[400px] mb-6 whitespace-nowrap"

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
            )}
        />
    );
}