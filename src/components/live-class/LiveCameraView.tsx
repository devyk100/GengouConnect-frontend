import {RefObject} from "react";
import {Button} from "@/components/ui/button";

export default function LiveCameraView({videoRef}: {
    videoRef: RefObject<HTMLVideoElement>;
}){
    return (
        <section className="flex h-full items-center justify-center p-6">
            <video id="video1" ref={videoRef} width="160" height="120" autoPlay muted></video>
            <Button onClick={() => {
                videoRef.current!.muted = false;
            }}>Play</Button>
        </section>
    )
}