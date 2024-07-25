import * as fabric from 'fabric';
import {
    BaseBrush,
    Canvas,
    Circle,
    CircleBrush,
    FabricObject,
    PatternBrush,
    PencilBrush,
    Rect,
    SprayBrush,
    Triangle,
    Text, Textbox
} from "fabric";
import {Ref, RefObject} from "react";
import {isNotOpeningBraceToken} from "@typescript-eslint/utils/ast-utils";
import {RGBColor} from "react-color";
import {EventType, UserType, WebSocketHandler} from "@/utils/WebSocketHandler";

export enum AnnotationType {
    Line = "line",
    FreeHand = "freehand",
    Rectangle = "rectangle",
    Circle = "circle",
    Text = "text",
    Image = "image"
}

export enum brushType{
    CircleBrush,
    SprayBrush,
    PatternBrush,
    PencilBrush
}

export class fabricApi{
    private static instance: fabricApi;
    private fillColor: RGBColor;
    private strokeColor: RGBColor;
    private canvasContext: Canvas | null;
    private selectedObj:  FabricObject[];
    private aspectRatioRef: RefObject<HTMLDivElement>;
    private canvasRef: RefObject<HTMLCanvasElement>;
    private userType: UserType;
    private isDrawingMode: boolean;
    private canvasHeight: number;
    private canvasWidth: number;
    private deleteOn: boolean;
    private strokeWidth: number;
    /**
     *
     * @param canvasRef is the ref of the canvas where fabricjs would work
     * @param aspectRatio is the outside container to maintain the aspect ratio of 16:9
     * @param options is the options for the construction of the fabricjs canvas
     * @param userType
     * @private constructor for the singleton purpose
     */
    private constructor(canvasRef: RefObject<HTMLCanvasElement>, aspectRatio: RefObject<HTMLDivElement>, options: object, userType: UserType) {
        this.fillColor = {
            r: 241,
            g: 112,
            b: 19,
            a: 1,
        }
        this.strokeColor = {
            r: 241,
            g: 0,
            b: 19,
            a: 1
        }
        this.selectedObj = []
        this.strokeWidth = 10;
        this.userType = userType;
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
        this.canvasContext!.renderOnAddRemove = true;
        this.canvasContext.on("mouse:down", function(options){
            if(!c.deleteOn) return;
            if(!options.target)return
            c.canvasContext!.remove(options.target)
        })
        this.canvasContext.on("selection:created", function(options){
            c.selectedObj = options.selected;
            console.log(options.selected.length)
        })
        this.canvasContext.on("selection:cleared", function(){
            c.selectedObj = [];
        })
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Delete' || event.keyCode === 46) {
                console.log("delete fired")
                c.deleteSelected();
            }
        });
        console.log(UserType, 'IS THE TYPE OF THE USER')
            // if(UserType.Instructor == userType){
            //     setInterval(() => {
            //         console.log("Sending the svg format whiteboard")
            //         WebSocketHandler.getSimpleInstance()?.sendEvent({
            //             eventType: EventType.Board,
            //             boardSvg: this.canvasContext?.toSVG()
            //         })
            //     }, 800)
            // }
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
        canvasRef, aspectRatio, options, userType
                       }: {
        canvasRef?: RefObject<HTMLCanvasElement>,
        aspectRatio?: RefObject<HTMLDivElement>,
        options?: object, userType?: UserType
    }){
        // console.log("Called", fabricApi.instance);
        if(fabricApi.instance && fabricApi.instance.canvasContext!=null){
            return fabricApi.instance;
        } else{
            console.log("Canvas was created", canvasRef, aspectRatio, options, userType )
            if(!canvasRef || !aspectRatio || !options || userType == null){ return }
            fabricApi.instance = new fabricApi(canvasRef, aspectRatio, options, userType);
            return fabricApi.instance;
        }
    }

    /**
     * Adding rectangle to the left most position based on the color
     */
    public addRect(){
        const rect = new Rect({
            fill: fabricApi.rgbToHex(this.fillColor),
            width: this.canvasWidth/3,
            height: this.canvasHeight/3,
            strokeWidth: this.strokeWidth,
            stroke: fabricApi.rgbToHex(this.strokeColor),
        })
        this.canvasContext?.add(rect);
    }



    public addCircle(){
        const circ = new Circle({
            fill: fabricApi.rgbToHex(this.fillColor),
            width: this.canvasWidth/3,
            height: this.canvasHeight/3,
            stroke: fabricApi.rgbToHex(this.strokeColor),
            strokeWidth: this.strokeWidth
        })
        this.canvasContext?.add(circ);
    }

    public addText(){
        const text = new Textbox("Text", {
            stroke: fabricApi.rgbToHex(this.strokeColor),
            fill: fabricApi.rgbToHex(this.fillColor),
        })
        text.fontStyle = "italic"
        this.canvasContext?.add(text)
    }

    public insertImage(){

    }

    /**
     * Toggling the freehand mode, which can be turned on to use as a pencil, or as a brush
     */
    public toggleFreeHandMode(){
        this.isDrawingMode = !this.isDrawingMode;
        this.canvasContext!.isDrawingMode = this.isDrawingMode;
        this.canvasContext!.freeDrawingBrush = new PatternBrush(this.canvasContext!)
        this.canvasContext!.freeDrawingBrush.color = "red"
    }



    public changeBrush(){

    }

    /**
     * The most import implementation to continuously start pushing to the websocket server, for the current slide, and also the current mouse position.
     */
    public pushToServer(){

    }


    /**
     *  As the slides would be made by the instructor beforehand, they must be stored somewhere and at the time of slideshow, made available to the instructor to switch and show whatever he wants.
     */
    public fetchAndChangeSlideTo(){

    }


    /**
     * Resizing the canvas pixel by pixel for responsiveness
     */
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


    /**
     * Delete the selection that was done by the user,
     * A VERY BIG ISSUE HERE THAT IT DOES NOT RERENDER WHEN WE DELETE MULTIPLE OBJECTS.
     */
    public deleteSelected(){
        let selectedCopy = this.selectedObj.slice(); // Create a copy

        selectedCopy.forEach(obj => {
            console.log("Deleting", obj);
            this.canvasContext?.remove(obj);
            this.canvasContext?.renderAll();
        });
        this.selectedObj = []

        this.canvasContext?.renderAndReset();
    }


    /**
     * change the color of the selected obj
     */
    public changeColorSelected(){
        for(let obj of this.selectedObj){
            obj.stroke = fabricApi.rgbToHex(this.strokeColor);
        }
    }

    /**
     * Change the fill color of the selected obj
     */
    public changeFillColorSelected(){
        for(let obj of this.selectedObj){
            obj.fill = fabricApi.rgbToHex(this.fillColor);
        }
    }

    public toggleBold(){

    }

    public changeFont(){

    }

    public toggleUnderline(){

    }

    public toggleItalic(){

    }

    public convertToSvg(){

    }


    /**
     * Cleanup to be done inside of the useeffect or anywhere else
     */
    public cleanUp(){
        this.canvasContext!.dispose();
        this.canvasContext = null;
        window.removeEventListener('resize', this.resizeListener);
    }


    /**
     * a standard function to convert RGB to HEX string
     * @param rgbColor takes in the type of fabric.RGBColor
     */
    static rgbToHex(rgbColor: RGBColor) {
        return '#' + ((1 << 24) + (rgbColor.r << 16) + (rgbColor.g << 8) + rgbColor.b).toString(16).slice(1);
    }
}