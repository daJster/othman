import {type FC, useEffect, useState} from "react";
import { motion, type Variants } from "framer-motion";
import {Button} from "@/components/ui/button.tsx";
import {DownloadIcon} from "lucide-react";

type WordSVGConfig = {
    src: string;
    top: string;
    left: string;
    scale?: number;
    rotate?: number;
    z?: number;
};

const ayahWords: WordSVGConfig[] = [
    {
        src: "/headerAyah/word1.svg",
        top: "4%",
        left: "67%",
        scale: 1.4,
    },
    {
        src: "/headerAyah/word2.svg",
        top: "20%",
        left: "52%",
        scale: 1, // closer
    },
    {
        src: "/headerAyah/word3.svg",
        top: "7%",
        left: "40%",
        scale: 1.4, // further
    },
    {
        src: "/headerAyah/word4.svg",
        top: "5%",
        left: "26%",
        scale: 1.4,
    },
    {
        src: "/headerAyah/word5.svg",
        top: "5%",
        left: "7.6%",
        scale: 1.4,
    },
];

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom * 0.2,
            duration: 0.6,
        },
    }),
};


const HomePageHeader: FC = () => {

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice

        if (choice.outcome === "accepted") {
            console.log("PWA installed")
        }

        setDeferredPrompt(null)
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white">

            <img
                src="/mosque.jpg"
                alt="mosque"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-white/80 to-black/60" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[20px_20px]" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

                {/* Ayah words */}
                <div className={"flex flex-col w-full items-center justify-center"}>
                    {/* Basmalah */}
                    <motion.img
                        src="/basmalah.svg"
                        alt="basmalah"
                        className="w-64 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    />

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative w-full max-w-120 h-20 mb-15"
                    >
                        {ayahWords.map((word, index) => (
                            <motion.img
                                key={word.src}
                                src={word.src}
                                alt={`word-${index}`}
                                custom={index}
                                variants={item}
                                className="absolute h-12 md:h-16"
                                style={{
                                    top: word.top,
                                    left: word.left,
                                    zIndex: word.z ?? 1,
                                }}
                                animate={{
                                    scale: word.scale ?? 1,
                                    rotate: word.rotate ?? 0,
                                }}
                            />
                        ))}
                    </motion.div>

                    <motion.p
                        className="mt-10 text-lg md:text-2xl text-white/90 font-medium tracking-wide text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        كُتَّاب عثمان بن عفان لحفظ القرآن ترحب بكم
                    </motion.p>

                    {deferredPrompt && (
                        <Button
                            variant={"default"}
                            onClick={handleInstall}
                            className="mt-10 flex items-center gap-2 justify-center cursor-pointer hover:bg-green-800 p-4 py-5"
                        >
                            <p>حمّل الآن</p>
                            <DownloadIcon/>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePageHeader;