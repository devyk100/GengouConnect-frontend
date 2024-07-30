import axios from "axios";
import {toast} from "sonner";
import {SFUHandler} from "@/utils/SFUHandler";
import {RefObject} from "react";

export interface Text {
    text: string;
    size: number;
    isBold: boolean;
}

export interface Annotation {
    x: number;
    y: number;
    color: string;
    thickness: number;
}

export interface Shape {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    shapeType: string;
    color: string;
    thickness: number;
}

export interface Image {
    url: string;
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface WebRTCEvent {
    Sdp: string
}


export interface SocketEvent {
    eventType: string;
    text?: Text;
    annotation?: Annotation;
    shape?: Shape;
    image?: Image;
    webrtcEvent?: WebRTCEvent;
    boardSvg?: string;
    // Assuming Chat type is also defined similarly in TypeScript
    // chat: Chat; // Define Chat interface as needed
}

export enum UserType {
    Instructor = 0,
    Learner = 1,
    Updates = 2
}

export type ChatType = {
    text: string;
    from: string;
}

export enum EventType {
    Chat = "chat",
    WebRtc = "webrtc",
    Board = "board"
}

export class WebSocketHandler {
    private socket: WebSocket | undefined;
    private readonly userId: string;
    private readonly classId: string;
    private videoRef: RefObject<HTMLVideoElement>
    private static instance: WebSocketHandler | null;
    private OnChat: (val: ChatType) => void;
    private OnEvent: (val: SocketEvent) => void;
    private userType: UserType;

    private initialize(userType: UserType, attempt: number) {
        if (attempt > 3) {
            // throw Error("Error in connecting to the websocket server, make sure the credentials are correct.")
            toast("The meeting is not scheduled or is invalid.", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Exit",
                    onClick: () => console.log("Undo"),
                }
            }
            )
        }
        console.log(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER, "Is the URL for websocket")
        this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER!}/ws?type=${userType}`);
        this.socket.onclose = () => {
            console.log("Connection closed");
        }
        this.socket.onmessage = (event: MessageEvent) => {
            // console.log(JSON.parse(event.data).success, "IS THE SUCCESS")
            if (JSON.parse(event.data).success == false) {
                this.socket!.close()
                console.log("REINIITIALIZE")
                this.initialize(userType, ++attempt)
            } else {
                toast("Successfully connected to the websocket server!", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                    actionButtonStyle: {
                        backgroundColor: "green",
                    }
                })

                SFUHandler.getInstance(this.classId, this.socket!, this.userType, this.videoRef)


                this.socket!.onmessage = (event: MessageEvent) => {
                    let data = JSON.parse(event.data)
                    console.log("A MESSAGE CAME", data.boardSvg)
                    if(data.eventType == EventType.Chat){
                        console.log("ON MESSAGE CALLED")
                        this.OnChat(data as ChatType)
                    }
                    else if(data.eventType == EventType.WebRtc){
                        console.log("Got the SDP remote")
                        SFUHandler.getInstance(this.classId, this.socket!, this.userType, this.videoRef).setRemoteDesc(data.webrtcEvent.sdp)
                    }
                    else{
                        this.OnEvent(data as SocketEvent)
                    }
                }
            }
        }
        this.socket.onopen = (event: Event) => {
            this.socket!.send(JSON.stringify({
                userId: this.userId,
                classId: this.classId
            }))
        }
    }

    private constructor(userType: UserType, classId: string, userId: string, videoRef: RefObject<HTMLVideoElement>) {
        this.userId = userId;
        this.userType = userType;
        this.classId = classId;
        this.videoRef = videoRef
        this.initialize(userType, 0)
        this.OnChat = (val: ChatType) => {

        }
        this.OnEvent = (val: SocketEvent) => {
        }
    }

    static getInstance(userType: UserType, classId: string, userId: string, videoRef: RefObject<HTMLVideoElement>): WebSocketHandler {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new WebSocketHandler(userType, classId, userId, videoRef)
            return this.instance;
        }
    }

    static getSimpleInstance(){
        if(this.instance){
            return this.instance;
        }
        else return null;
    }

    sendChat(text: string) {
        if (this.userType == UserType.Instructor) {
            this.socket!.send(JSON.stringify({
                eventType: EventType.Chat,
                chat: {
                    text: text,
                    from: this.userId
                }
            }))
            return true
        } else {
            this.socket!.send(JSON.stringify({
                eventType: EventType.Chat,
                text: text,
                from: this.userId

            }))
            return true
        }
    }

    async getChats() {
        console.log("Get chats called", `${process.env.NEXT_PUBLIC_WEBSOCKET_HTTP_URL}/chats?classId=${this.classId}&userId=${this.userId}`)
        const val = await axios.get(`${process.env.NEXT_PUBLIC_WEBSOCKET_HTTP_URL}/chats?classId=${this.classId}&userId=${this.userId}`)
        // console.log(val.data)
        return val.data
    }

    setOnChatHandler(callback: (val: ChatType) => void) {
        this.OnChat = callback;
    }

    setOnEventHandler(callback: (val: SocketEvent) => void) {
        this.OnEvent = callback;
    }

    sendEvent(val: SocketEvent) {
        console.log(JSON.stringify(val));
        // if(this.socket)
        this.socket!.send(JSON.stringify(val))
    }

    sendWebRtcDesc(localDes: string ){

    }



    Close() {
        this.socket?.close()
        WebSocketHandler.instance = null;
    }

}