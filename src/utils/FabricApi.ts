import * as fabric from 'fabric';
import {RefObject} from "react";
export class fabricApi{
    private static instance: fabric.Canvas;
    private constructor(public canvas: RefObject<HTMLCanvasElement>){

    }
    static getInstance(canvas: RefObject<HTMLCanvasElement>){
        if(!canvas) return
        console.log("Called", fabricApi.instance);
        if(fabricApi.instance){
            return fabricApi.instance;
        } else{
            fabricApi.instance = new fabric.Canvas(canvas.current!, {
                height: 1080,
                width: 1920
            })
        }
    }
}