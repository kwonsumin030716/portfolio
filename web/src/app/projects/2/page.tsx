'use client';

import React, {useState, useRef, useEffect} from 'react';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { projectData } from "@/data/projects";
import BasePage from "@/components/BasePage";

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
        <BasePage projectData={data!}>
            <div>
                hello
            </div>
        </BasePage>
    );
}