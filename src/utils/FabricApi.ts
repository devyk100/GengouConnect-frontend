import * as fabric from 'fabric';
import {BaseBrush, Canvas, Circle, PencilBrush, Rect, Triangle} from "fabric";
import {Ref, RefObject} from "react";
export enum userType{
    instructor="instructor",
    learner="learner",
}
export enum AnnotationType {
    Line = "line",
    FreeHand = "freehand",
    Rectangle = "rectangle",
    Circle = "circle",
    Text = "text",
    Image = "image"
}

export class fabricApi{
    private static instance: fabricApi;
    private canvasContext: Canvas | null;
    private aspectRatioRef: RefObject<HTMLDivElement>;
    private canvasRef: RefObject<HTMLCanvasElement>;
    private UserType: userType;
    private isDrawingMode: boolean;
    private canvasHeight: number;
    private canvasWidth: number;
    private deleteOn: boolean;
    /**
     *
     * @param canvasRef is the ref of the canvas where fabricjs would work
     * @param aspectRatio is the outside container to maintain the aspect ratio of 16:9
     * @param options is the options for the construction of the fabricjs canvas
     * @param UserType is the type of user to further prevent sending malicious broadcasting of the whiteboard to the websocket server
     * @private constructor for the singleton purpose
     */
    private constructor(canvasRef: RefObject<HTMLCanvasElement>, aspectRatio: RefObject<HTMLDivElement>, options: object, UserType: userType) {
        this.UserType = UserType;
        this.canvasRef = canvasRef;
        this.canvasContext = new Canvas(canvasRef.current!, options);
        this.aspectRatioRef = aspectRatio
        this.isDrawingMode = false;
        this.deleteOn =  false;
        this.canvasWidth = this.aspectRatioRef.current!.clientWidth;
        this.canvasHeight = this.aspectRatioRef.current!.clientHeight;
        this.resizeListener();
        window.addEventListener("resize", this.resizeListener);
        this.canvasContext.enablePointerEvents=true;
        const c = this
        this.canvasContext.on("mouse:down", function(options){
            if(!c.deleteOn) return;
            if(!options.target)return
            c.canvasContext!.remove(options.target)
        })
        // this.canvasContext.freeDrawingBrush!.width = 10
        // const rect = new Rect({
        //     left: 100,
        //     top: 100,
        //     fill: 'red',
        //     width: 20,
        //     height: 20,
        //     hasControls: true
        // })
        // this.canvasContext.add(rect)
        // // rect.set({ left: 20, top: 50 });
        // var circle = new Circle({
        //     radius: 20, fill: 'green', left: 100, top: 100
        // });
        // var triangle = new Triangle({
        //     width: 20, height: 30, fill: 'blue', left: 50, top: 50
        // });
        //
        // this.canvasContext.add(circle, triangle);
    }

    /**
     * A static method to get the singleton instance of this class
     */
    static getInstance({
        canvasRef, aspectRatio, options, UserType
                       }: {
        canvasRef?: RefObject<HTMLCanvasElement>,
        aspectRatio?: RefObject<HTMLDivElement>,
        options?: object, UserType?: userType
    }){
        // console.log("Called", fabricApi.instance);
        if(fabricApi.instance && fabricApi.instance.canvasContext!=null){
            return fabricApi.instance;
        } else{
            if(!canvasRef || !aspectRatio || !options || !UserType){ return }
            fabricApi.instance = new fabricApi(canvasRef, aspectRatio, options, UserType);
            return fabricApi.instance;
        }
    }

    /**
     * Adding rectangle to the left most position based on the color
     */
    public addRect(){
        const rect = new Rect({
            fill: 'red',
            width: this.canvasWidth/3,
            height: this.canvasHeight/3,
        })
        this.canvasContext?.add(rect);
    }


    public addCircle(){

    }
    public insertImage(){

    }
    public toggleFreeHandMode(){
        this.isDrawingMode = !this.isDrawingMode;
        this.canvasContext!.isDrawingMode = this.isDrawingMode;
        this.canvasContext!.freeDrawingBrush = new PencilBrush(this.canvasContext!)
        this.canvasContext!.freeDrawingBrush.color = "red"

    }
    public pushToServer(){

    }
    public fetchAndChangeSlideTo(){

    }
    public resizeListener = () => {
        const canvasElement = this.canvasRef.current;
        if (canvasElement) {
            // console.log(this.aspectRatioRef.current!.clientWidth, this.aspectRatioRef.current!.clientHeight);
            this.canvasWidth = this.aspectRatioRef.current!.clientWidth;
            canvasElement.width = this.aspectRatioRef.current!.clientWidth;
            this.canvasHeight = this.aspectRatioRef.current!.clientHeight
            canvasElement.height = this.aspectRatioRef.current!.clientHeight;
            this.canvasContext!.setDimensions({
                width: this.aspectRatioRef.current!.clientWidth,
                height: this.aspectRatioRef.current!.clientHeight
            });
            this.canvasContext!.renderAll();
        }
    };
    public cleanUp(){
        this.canvasContext!.dispose();
        this.canvasContext = null;
        window.removeEventListener('resize', this.resizeListener);
    }
}