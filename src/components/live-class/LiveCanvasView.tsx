"use client"
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Canvas} from "fabric"
import ColorPicker from "@/components/ColorPicker"; // browser
import rectIcon from "@/../public/rectangle.svg"
import pencilIcon from "@/../public/pencil.svg"
import circleIcon from "@/../public/circle.svg"
import cursorTextIcon from "@/../public/cursor-text.svg"
import lineIcon from "@/../public/line.svg"
import imageInPictureIcon from "@/../public/image-in-picture.svg"
import trashIcon from "@/../public/trash.svg"
import Image from "next/image";
import {fabricApi, userType} from "@/utils/FabricApi";

function ToolBar() {
    return (
        <span className="py-2">
            <ul className="flex">
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={pencilIcon} alt={"Pencil"}/>
                    </Button>
                </li>
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.addRect()
                    }}>
                    <Image src={rectIcon} alt={"Rectangle"}/>
                </Button>
                </li>
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={circleIcon} alt={"circle"}/>
                    </Button>
                </li>
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={cursorTextIcon} alt={"cursor text icon"}/>
                    </Button>
                </li>
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={lineIcon} alt={"line icon"}/>
                    </Button>
                </li>
                <li>
                    <Button variant={"default"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={imageInPictureIcon} alt={"image in picture icon"}/>
                    </Button>
                </li>
                <li>
                    <Button variant={"destructive"} className="rounded-none" onClick={() => {
                        fabricApi.getInstance({})?.toggleFreeHandMode()
                    }}>
                        <Image src={trashIcon} alt={"trash icon"}/>
                    </Button>
                </li>
            </ul>
                <ColorPicker/>
        </span>
    )
}

export default function LiveCanvasView() {
    const [canvasContext, updateCanvasContext] = useState<Canvas | null>();
    const aspectRatioRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current || !aspectRatioRef.current) return
        const fabricApiInstance = fabricApi.getInstance({
            canvasRef: canvasRef,
            aspectRatio: aspectRatioRef,
            UserType: userType.instructor,
            options: {}
        })
        fabricApiInstance!.addRect()
        return () => {
            fabricApiInstance!.cleanUp();
        }
    }, []);
    return (
        <section className="flex h-screen flex-col items-center justify-center p-6">
            <ToolBar/>
            <AspectRatio ref={aspectRatioRef} className="aspect-ratio" ratio={16 / 9}>
                <canvas ref={canvasRef} className="w-full h-full z-30"/>
            </AspectRatio>
        </section>
    )
}