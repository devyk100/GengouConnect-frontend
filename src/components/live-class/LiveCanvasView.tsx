"use client"
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {useEffect, useRef, useState} from "react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group"
import {Button} from "@/components/ui/button";
import dynamic from "next/dynamic";
import {Canvas, Rect} from 'fabric'; // browser
enum AnnotationType {
    Line = "line",
    FreeHand = "freehand",
    Rectangle = "rectangle",
    Circle = "circle",
    Text = "text",
    Image = "image"
}

function ToolBar() {
    return (
        <span className="py-2">
            <ToggleGroup type="single">
                <ToggleGroupItem value={AnnotationType.Line}>Line</ToggleGroupItem>
                <ToggleGroupItem value={AnnotationType.FreeHand}>Free</ToggleGroupItem>
                <ToggleGroupItem value={AnnotationType.Rectangle}>Rect</ToggleGroupItem>
                <ToggleGroupItem value={AnnotationType.Circle}>Circle</ToggleGroupItem>
                <ToggleGroupItem value={AnnotationType.Text}>Text</ToggleGroupItem>
                <ToggleGroupItem value={AnnotationType.Image}>Image</ToggleGroupItem>
            </ToggleGroup>
        </span>
    )
}

export default function LiveCanvasView() {
    const [canvasContext, updateCanvasContext] = useState<Canvas | null>();
    const aspectRatio = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const options = {};
        const canvas = new Canvas(canvasRef.current!, options);
        canvas.add(new Rect({
            height: 500,
            width: 100,
            backgroundColor: "red",
            rx: 100
        }))
        // make the fabric.Canvas instance available to your app
        const resizeListener = () => {
            const canvasElement = canvasRef.current;
            if (canvasElement) {
                console.log(aspectRatio.current!.clientWidth, aspectRatio.current!.clientHeight);
                canvasElement.width = aspectRatio.current!.clientWidth;
                canvasElement.height = aspectRatio.current!.clientHeight;
                canvas.setDimensions({ width: aspectRatio.current!.clientWidth, height: aspectRatio.current!.clientHeight });
                canvas.renderAll();
            }
        };

        resizeListener();

        window.addEventListener("resize", resizeListener);

        return () => {
            window.removeEventListener("resize", resizeListener);
            updateCanvasContext(null);
            canvas.dispose().then(r => {});
        };
    }, []);
    return (
        <section className="flex h-screen flex-col items-center justify-center p-6">
            <ToolBar/>
            <Button onClick={() => {
            }}>Click</Button>
            <AspectRatio ref={aspectRatio} className="aspect-ratio" ratio={16 / 9}>
                <canvas ref={canvasRef} className="w-full h-full"/>
            </AspectRatio>
        </section>
    )
}