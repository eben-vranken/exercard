'use client'

import Navbar from "@/components/UI/functional/Navbar";
import useGetDueCards from "@/hooks/filesystem/card/useGetDueCards";
import useReviewCard from "@/hooks/filesystem/card/useReviewCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Card {
    id: Number;
    deckId: number;
    front: string;
    back: string;
    retrievability: number;
    stability: number;
    difficulty: number;
}

const CardReview: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';

    const [answered, setAnswered] = useState<boolean>(false);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchDueCards = async () => {
            const results = await useGetDueCards(Number(deckId))
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
            } else {
                console.error(`Error fetching cards: ${results.message}`);
            }
        }
        fetchDueCards();
    }, [deckId])

    const handleReview = async (grade: string) => {
        console.log(`Card reviewed with rating: ${grade}`);
        try {
            const result = await useReviewCard(grade);

            if (result.status === 'ok') {
                console.log("Card reviewed successfully");
                setAnswered(false);
                cards.shift();

                if (cards.length === 0) {
                    router.back();
                }
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setAnswered(true);
            }

            const keyActions: { [key: string]: string } = {
                Digit0: "0",
                Digit1: "1",
                Digit2: "2",
                Digit3: "3",
                Digit4: "4",
            };

            if (keyActions[event.code] && answered) {
                handleReview(keyActions[event.code]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [answered]);

    const handleButtonClick = (grade: string, event: React.MouseEvent<HTMLButtonElement>) => {
        handleReview(grade);
        (event.target as HTMLButtonElement).blur();
    };

    return (
        <section className="w-full h-full flex flex-col">
            <Navbar />

            <section className="w-full h-full flex flex-col items-center justify-center">
                {
                    cards.length > 0 ?
                        <section className="h-full w-full flex flex-col items-center justify-around">
                            {/* Cards */}
                            < section className="w-full flex flex-col items-center justify-center relative">
                                <h1 className="font-semibold text-light text-center mb-3">
                                    <span className="text-green-500 opacity-50">
                                        {cards.length}
                                    </span>
                                    &nbsp;
                                    cards for review
                                </h1>

                                {/* Current card */}
                                <section className="border border-white/5 rounded aspect-video w-3/5 flex justify-center items-center px-5 overflow-hidden lg:text-lg xl:text-2xl text-center">
                                    <h1>
                                        {
                                            answered ? cards[0].back : cards[0].front
                                        }
                                    </h1>
                                </section>

                                {/* Card Stack */}
                                <section className="w-[55%] h-2 mx-auto bg-white/[3%] rounded-b border border-white/5 opacity-75"></section>
                                <section className="w-[50%] h-2 mx-auto bg-white/[3%] rounded-b border border-white/5 opacity-50"></section>
                                <section className="w-[45%] h-2 mx-auto bg-white/[3%] rounded-b border border-white/5 opacity-25"></section>
                            </section>

                            {/* Actions */}
                            <section className={`flex gap-x-2 font-semibold ${answered ? "" : "opacity-0 pointer-events-none"}`}>
                                <button onClick={(e) => handleButtonClick("0", e)} className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-red-500/75 opacity-50">
                                    <span className="text-light">0.</span>
                                    Again
                                </button>
                                <button onClick={(e) => handleButtonClick("1", e)} className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-orange-500/75 opacity-50">
                                    <span className="text-light">1.</span>
                                    Hard
                                </button>
                                <button onClick={(e) => handleButtonClick("2", e)} className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-yellow-500/75 opacity-50">
                                    <span className="text-light">2.</span>
                                    Normal
                                </button>
                                <button onClick={(e) => handleButtonClick("3", e)} className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-green-500/75 opacity-50">
                                    <span className="text-light">3.</span>
                                    Easy
                                </button>
                                <button onClick={(e) => handleButtonClick("4", e)} className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-blue-500/75 opacity-50">
                                    <span className="text-light">4.</span>
                                    Perfect
                                </button>
                            </section>

                        </section>
                        :
                        <span className="text-light">Loading...</span>
                }
            </section >
        </section>
    )
}

export default CardReview;