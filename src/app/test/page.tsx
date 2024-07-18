"use client"
import dynamic from 'next/dynamic';
import {SessionProvider, useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import {UserType} from "@/utils/WebSocketHandler";
import LiveClassComponent from "@/components/live-class/LiveClassComponent";
// const LiveClassComponent = dynamic(() => import("@/components/live-class/LiveClassComponent"), { ssr: false });

export default function Home() {
    const classId =  "123"
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    let userType : UserType = UserType.Learner;
    if(type == "0"){
        userType = UserType.Instructor
    }
    else if(type == "1"){
        userType = UserType.Learner
    }
    const userId = Math.random().toString(36)
    return (
        <>
            <SessionProvider>
            <LiveClassComponent classId={classId} userId={userId} userType={userType} />
            </SessionProvider>
        </>
    );
}
