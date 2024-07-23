import React, {RefObject} from "react";

export class CanvasApi {
    private static instance: CanvasApi;
    private canvas: RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;
    private strokeStyle: string;
    private lineWidth: number;
    private lineCap: string;
    private mouseDownHandler: (event: MouseEvent) => void;
    private mouseMoveHandler: (event: MouseEvent) => void;
    private prevX: number;
    private prevY: number;
    private currX: number;
    private currY: number;
    private isMouseDown: boolean;
    // private readonly chunkWidth: number = 480;
    // private readonly chunkHeight: number = 216;
    // private
    private constructor(canvas: RefObject<HTMLCanvasElement>) {
        this.canvas = canvas!;
        this.strokeStyle = "blue";
        this.lineWidth = 2;
        this.prevX = 0;
        this.currX = 0;
        this.prevY = 0;
        this.currY = 0;
        this.lineCap = "round";
        this.isMouseDown = false;
        this.ctx = canvas.current!.getContext('2d')!;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        const canvasObj = this;
        this.canvas.current?.addEventListener("mousedown", (event: MouseEvent) => {
            console.log("MOUSE DOWN Callaed")
            canvasObj.isMouseDown = true;
        })

        this.canvas.current?.addEventListener("mouseup", (event: MouseEvent) => {
            canvasObj.isMouseDown = false;
        })

        this.mouseDownHandler  = (e: MouseEvent) => null;
        this.mouseMoveHandler = (e: MouseEvent) => null;

        this.canvas.current?.addEventListener('mousemove', function(e) {
            canvasObj.prevX = canvasObj.currX;
            canvasObj.prevY = canvasObj.currY;
            canvasObj.currY = (canvasObj.canvas.current!.height/canvasObj.canvas.current!.getBoundingClientRect().height)*e.offsetY;
            canvasObj.currX = (canvasObj.canvas.current!.width/canvasObj.canvas.current!.getBoundingClientRect().width)*e.offsetX;
        }, false);
    }

    setCanvasMouseDownHandler(handler: (event: MouseEvent) => void): void {
        this.canvas!.current?.removeEventListener("mousedown", this.mouseDownHandler);
        this.mouseDownHandler = handler;
        this.canvas!.current?.addEventListener("mousedown", this.mouseDownHandler);
    }

    setCanvasMouseMoveHandler(handler: (event: MouseEvent) => void): void {
        this.canvas!.current?.removeEventListener("mousemove", this.mouseMoveHandler);
        this.mouseMoveHandler = handler;
        this.canvas!.current?.addEventListener("mousemove", this.mouseMoveHandler);
    }

    setColor(color: string){
        this.strokeStyle = color;
        this.ctx.strokeStyle = color;
    }

    setStrokeWidth(width: number){
        this.lineWidth = width
        this.ctx.lineWidth = width;
    }

    handleFreeHandDrawing(){
        const freeHandDrawing = (event: MouseEvent) => {
            if(!this.isMouseDown) return
            this.ctx.beginPath()
            this.ctx.moveTo(this.prevX, this.prevY);
            this.ctx.lineTo(this.currX, this.currY);
            this.ctx.stroke();
        }
        this.setCanvasMouseMoveHandler(freeHandDrawing);
        this.setCanvasMouseDownHandler(freeHandDrawing);
    }

    handleLineDrawing(){
        let isLineStarted = false;
        this.canvas.current?.addEventListener("mouseup", () => {
            isLineStarted = false;
        })
        const lineDrawing = (event: MouseEvent) => {
            if(!this.isMouseDown || isLineStarted) return
            if(!isLineStarted){
                console.log("Line started")
                this.ctx.beginPath();
                this.ctx.moveTo(this.currX, this.currY);
                isLineStarted = true;
            }
            else {
                console.log("Line ended")
                this.ctx.lineTo(this.currX, this.currY);
                isLineStarted = false;
            }

        }
        this.setCanvasMouseMoveHandler(lineDrawing)
    }

    loadPreviousData(): void {

    }

    static getInstance(canvas: RefObject<HTMLCanvasElement>): CanvasApi {
        if(CanvasApi.instance){
            return CanvasApi.instance;
        }
        else{
            CanvasApi.instance = new CanvasApi(canvas);
            return CanvasApi.instance;
        }
    }
}