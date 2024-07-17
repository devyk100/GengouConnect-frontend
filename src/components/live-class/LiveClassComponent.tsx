"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import LiveChatView from "@/components/live-class/LiveChatView";
import LiveCameraView from "@/components/live-class/LiveCameraView";
import LiveCanvasView from "@/components/live-class/LiveCanvasView";
import {useEffect, useState} from "react";
import {UserType, WebSocketHandler} from "@/utils/WebSocketHandler";

export function Resizable({classId, userId, userType}: {
    classId: string;
    userId: string;
    userType: UserType
}) {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="w-screen rounded-lg border h-screen"
        >
            <ResizablePanel defaultSize={80}>
                <LiveCanvasView />
            </ResizablePanel>
            <ResizableHandle className="dark:bg-primary bg-primary-foreground" />
            <ResizablePanel defaultSize={20}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={25}>
                        <LiveCameraView />
                    </ResizablePanel>
                    <ResizableHandle className="dark:bg-primary bg-primary-foreground" />
                    <ResizablePanel defaultSize={75}>
                        <LiveChatView classId={classId} userId={userId} userType={userType}/>
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
    useEffect(() => {
        const connection = WebSocketHandler.getInstance(UserType.Instructor, classId, userId)

    })

    return (
        <>
                <Resizable classId={classId} userId={userId} userType={userType}/>
        </>
    )
}