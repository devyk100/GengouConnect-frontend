import {EventType, UserType, WebSocketHandler} from "@/utils/WebSocketHandler";
import {Ref, RefObject} from "react";

export class SFUHandler {
    private static instance: SFUHandler;
    private userType: UserType;
    private socket: WebSocket;
    private classId: string;
    private videoRef: RefObject<HTMLVideoElement>;
    private peerConnection: RTCPeerConnection;

    private constructor(classId: string, socket: WebSocket, userType: UserType, videoRef: RefObject<HTMLVideoElement>) {
        this.videoRef = videoRef
        this.classId = classId;
        this.socket = socket;
        this.userType = userType;
        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [`stun:${process.env.NEXT_PUBLIC_TURN_IP}:3478`, "stun:stun.l.google.com:19302", `turn:${process.env.NEXT_PUBLIC_TURN_IP}:3478`,],
                    username: "user",
                    credential: "pass"
                }
            ]
        })

        this.peerConnection.onicecandidate = (event) => {
            console.log(this.peerConnection.iceConnectionState)
        }

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate === null) {
                const localDes = (btoa(JSON.stringify(this.peerConnection.localDescription)))
                this.socket.send(JSON.stringify({
                    eventType: EventType.WebRtc,
                    webrtcEvent: {
                        sdp: localDes
                    }
                }))
            }
        }

        if (this.userType == UserType.Instructor) {
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {

                // THERE COULD BE MULTIPLE, OR NOTHING, WITH AUDIO, HANDLE THAT CASE.

                stream.getTracks().forEach(track => {
                    console.log(track, "FOUND");
                    this.peerConnection.addTrack(track, stream);
                })
                console.log("ADDED STREAM TO VIDEO REF OUTSIDE")
                if (videoRef != null ) {
                    // stream.getVideoTracks()
                    videoRef.current!.srcObject = stream
                    console.log("ADDED STREAM TO VIDEO REF")
                }

                this.peerConnection.createOffer().then(desc => {
                    this.peerConnection.setLocalDescription(desc).catch(console.log);
                })

            })
        } else {
            this.peerConnection.addTransceiver("video")
            this.peerConnection.addTransceiver("audio")
            this.peerConnection.createOffer().then(desc => {
                this.peerConnection.setLocalDescription(desc).catch(console.log);
            })

            this.peerConnection.ontrack = (event) => {
                console.log(event.streams)
                this.videoRef.current!.srcObject = event.streams[0]
                this.videoRef.current!.autoplay = true
                this.videoRef.current!.controls = true
                this.videoRef.current!.play()
            }
        }
    }

    static getInstance(classId: string, socket: WebSocket, userType: UserType, videoRef: RefObject<HTMLVideoElement>) {
        if (SFUHandler.instance) {
            return SFUHandler.instance
        } else {
            SFUHandler.instance = new SFUHandler(classId, socket, userType, videoRef)
            return SFUHandler.instance
        }
    }

    setRemoteDesc(desc: string) {
        this.peerConnection.setRemoteDescription(JSON.parse(atob(desc))).catch(r => alert(r))
    }

}