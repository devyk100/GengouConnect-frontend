import {ChatType, UserType, WebSocketHandler} from "@/utils/WebSocketHandler";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input"
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";

type User = {
    userType: UserType
    classId: string
    userId: string
}

export default function LiveChatView({classId, userId, userType}: {
    classId: string;
    userId: string;
    userType: UserType
}) {
    const [chatText, setChatText] = useState<string>("");
    const info = useQuery({ queryKey: ['chatList'], queryFn: () => WebSocketHandler.getInstance(userType, classId, userId).getChats() })
    const [Chats, setChats] = useState<ChatType[]>([]);
    useEffect(() => {
        if(info.data)
        setChats(info.data.filter((val:any) => val.from != ""));
    }, [info.data]);
    useEffect(() => {
        console.log("RERENDERED")
        WebSocketHandler.getInstance(userType, classId, userId).setOnChatHandler((val) => {
            setChats((prevChats) => [...prevChats, val]);
            console.log("NEW CHAT CAME", val.from);
        })
        inputRef.current?.addEventListener("keyup", (event) => {
            if (event.key != "enter") return
            WebSocketHandler.getInstance(userType, classId, userId).sendChat(chatText)
            setChatText("");
        })
    }, [])
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <section className="flex h-full flex-col items-center justify-center py-6 px-2">
            <ScrollArea className="items-center h-full justify-center w-full py-6 px-2">
                {Chats.map((chat: ChatType) => {
                    return (
                        <div key={chat.text} className="py-2">
                            <div className="text-sm font-normal">{chat.from}</div>
                            <div className="text-lg">{chat.text}</div>
                            <Separator/>
                        </div>
                    )
                })}
            </ScrollArea>
            <div className="flex w-[100%] items-center justify-center ">
                <Input value={chatText}
                       ref={inputRef}
                       className={"w-fit"}
                       onChange={e => setChatText(e.target.value)}/>
                <Button onClick={() => {
                // console.log(WebSocketHandler.getInstance(UserType.Instructor, classId, userId))
                WebSocketHandler.getInstance(userType, classId, userId).sendChat(chatText)
                setChatText("")
            }}>Send</Button>
            </div>
        </section>
    )
}