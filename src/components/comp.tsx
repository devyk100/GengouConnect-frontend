import {useSession} from "next-auth/react";

export default function Comp (){
    const session = useSession()
    console.log("session", session)
    return (
        <>
        Hello world
        </>

    )
}