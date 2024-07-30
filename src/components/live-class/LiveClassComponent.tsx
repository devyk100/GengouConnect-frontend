"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import LiveChatView from "@/components/live-class/LiveChatView";
import LiveCameraView from "@/components/live-class/LiveCameraView";
import LiveCanvasView from "@/components/live-class/LiveCanvasView";
import {RefObject, useEffect, useRef, useState} from "react";
import {UserType, WebSocketHandler} from "@/utils/WebSocketHandler";

export function Resizable({classId, userId, userType, videoRef}: {
    classId: string;
    userId: string;
    userType: UserType;
    videoRef: RefObject<HTMLVideoElement>;
}) {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="w-screen rounded-lg border h-screen"
        >
            <ResizablePanel defaultSize={80}>
                <LiveCanvasView userType={userType}/>
            </ResizablePanel>
            <ResizableHandle className="dark:bg-primary bg-primary-foreground" />
            <ResizablePanel defaultSize={20}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={25}>
                        <LiveCameraView videoRef={videoRef}/>
                    </ResizablePanel>
                    <ResizableHandle className="dark:bg-primary bg-primary-foreground" />
                    <ResizablePanel defaultSize={75}>
                        <LiveChatView classId={classId} userId={userId} userType={userType} videoRef={videoRef}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default function LiveClassComponent({classId, userId, userType}: {
    classId: string;
    userId: string;
    userType: UserType
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        WebSocketHandler.getInstance(UserType.Instructor, classId, userId, videoRef)
    }, [videoRef])
    return (
        <>
                <Resizable classId={classId} userId={userId} videoRef={videoRef} userType={userType}/>
        </>
    )
}