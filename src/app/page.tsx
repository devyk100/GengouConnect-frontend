import Image from "next/image";
import {AspectRatio} from "@/components/ui/aspect-ratio"
import LandingImage_1 from "../../public/Landing/LandingImage_1.png"
import LandingImage_2 from "../../public/Landing/LandingImage_2.webp"
import { getServerSession } from "next-auth"


export default async function Home() {
    const session = await getServerSession();
    console.log(session)

    return (
        <>
            <section className="h-screen flex flex-col items-center justify-center w-full overflow-x-hidden">
                <div className="flex flex-col md:flex-row w-screen items-center justify-center ">
                    <div className="px-4">
                        <div className="page text-center text-4xl dark:text-white bg-transparent font-bold py-2">
                            Connect to various language mentors
                        </div>
                        <div className="text-xl dark:text-white py-2 text-center bg-transparent">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At aut commodi expedita ipsam iure
                            nostrum obcaecati, quibusdam quod totam vero?
                        </div>
                        <div className="flex flex-col justify-center py-2 items-center w-full">
                            <span className="text-2xl font-semibold">Features:</span>
                            <ul className="list-disc text-xl dark:text-white py-2 ">
                                <li>Custom slides</li>
                                <li>Chat</li>
                                <li>Realtime annotations</li>
                            </ul>
                        </div>
                    </div>
                    <Image src={LandingImage_1} alt="Image" className="rounded-md object-cover md:w-[50vw]"/>
                </div>
            </section>
            <section className="min-h-screen w-full overflow-x-hidden items-center justify-center ">
                    <div className="flex flex-col md:flex-row w-screen items-center justify-center">
                        <div className="px-4">
                            <div className="px-4">
                                <div className="page text-center text-3xl dark:text-white bg-transparent font-bold py-2">
                                    Flashcards to help you remember better
                                </div>
                                <div className="text-xl dark:text-white py-2 text-center bg-transparent">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. At aut commodi expedita ipsam iure
                                    nostrum obcaecati, quibusdam quod totam vero?
                                </div>
                                <div className="flex flex-col justify-center py-2 items-center w-full">
                                    <span className="text-2xl">Features:</span>
                                    <ul className="list-disc text-xl dark:text-white py-2 ">
                                        <li>Custom slides</li>
                                        <li>Chat</li>
                                        <li>Realtime annotations</li>
                                    </ul>
                                </div>
                        </div>
                        </div>
                        <Image src={LandingImage_2} alt="Image" className="rounded-md object-cover md:w-[50vw]"/>
                    </div>

            </section>
        </>
    );
}
