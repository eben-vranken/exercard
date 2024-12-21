'use client'

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

    const [flipped, setFlipped] = useState<boolean>(false);
    const [answered, setAnswered] = useState<boolean>(false);
    const [answeredAnimation, setAnsweredAnimation] = useState<string>('');
    const [cards, setCards] = useState<Card[]>([]);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

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
        if (isTransitioning) return;

        console.log(`Card reviewed with rating: ${grade}`);
        try {
            const result = await useReviewCard(grade);

            if (result.status === 'ok') {
                setAnswered(true);
                setAnsweredAnimation(`answered-${grade}`);
                setIsTransitioning(true);
                setSelectedGrade(grade);
            }

        } catch (err) {
            console.error(err);
        }
    };

    let navigationTriggered = false;

    const handleAnimationEnd = () => {
        if (answered) {
            setCards(prevCards => {
                const newCards = [...prevCards];
                newCards.shift();

                if (newCards.length === 0 && !navigationTriggered) {
                    navigationTriggered = true;
                    router.back();
                }

                return newCards;
            });

            setAnsweredAnimation("");
            setAnswered(false);
            setFlipped(false);
            setIsTransitioning(false);
            setSelectedGrade(null);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setFlipped(true);
            }

            const keyActions: { [key: string]: string } = {
                Digit1: "0",
                Digit2: "1",
                Digit3: "2",
                Digit4: "3",
                Digit5: "4",
            };

            if (keyActions[event.code] && flipped && !isTransitioning) {
                handleReview(keyActions[event.code]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [flipped, isTransitioning]);

    const handleButtonClick = (grade: string, event: React.MouseEvent<HTMLButtonElement>) => {
        handleReview(grade);
        (event.target as HTMLButtonElement).blur();
    };

    const renderStackLayers = () => {
        const layers = [];
        const totalStacks = Math.min(3, cards.length - 1);

        for (let i = 0; i < totalStacks; i++) {
            const width = 100 - (i + 2);
            const opacity = 0.75 - (i * 0.25);

            layers.push(
                <section
                    key={i}
                    className="h-2 mx-auto bg-white/[3%] rounded-b border border-white/5 transition-opacity duration-300"
                    style={{ opacity, width: `${width}%` }}
                />
            );
        }

        return layers;
    };

    return (
        <section className="h-full w-full flex flex-col items-center justify-center">
            {
                cards.length > 0 ? <section className="h-full w-full flex flex-col items-center justify-around">
                    {/* Cards */}
                    <section className="w-full flex flex-col items-center justify-center relative">
                        <h1 className="font-semibold text-light text-center mb-3">
                            <span className="text-green-500 opacity-50">
                                {cards.length}
                            </span>
                            &nbsp;
                            cards for review
                        </h1>

                        {/* Current card */}
                        <section className="w-3/5 flex flex-col">
                            <section
                                className={`
                                ${answeredAnimation} 
                                ${!answeredAnimation && !isTransitioning ? 'card-entry' : ''} 
                                border border-white/5 rounded aspect-video flex flex-col gap-y-3 justify-center items-center px-5 overflow-hidden lg:text-lg xl:text-2xl text-center
                            `}
                                onAnimationEnd={answered ? handleAnimationEnd : undefined}
                            >
                                <h1>
                                    {cards[0].front}
                                </h1>

                                <h1 className={`text-light ${flipped ? "text-fadein" : "opacity-0"}`}>
                                    {cards[0].back}
                                </h1>
                            </section>

                            {/* Card Stack */}
                            <section className="w-full">
                                {renderStackLayers()}
                            </section>
                        </section>

                    </section>

                    {/* Actions */}
                    <section className={`flex gap-x-2 font-semibold ${flipped ? "" : "opacity-0 pointer-events-none"}`}>
                        <button onClick={(e) => handleButtonClick("0", e)} className={`flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-red-500/75 opacity-50 ${selectedGrade === "0" ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">1.</span>
                            Again
                        </button>
                        <button onClick={(e) => handleButtonClick("1", e)} className={`flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-orange-500/75 opacity-50 ${selectedGrade === "1" ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">2.</span>
                            Hard
                        </button>
                        <button onClick={(e) => handleButtonClick("2", e)} className={`flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-yellow-500/75 opacity-50 ${selectedGrade === "2" ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">3.</span>
                            Normal
                        </button>
                        <button onClick={(e) => handleButtonClick("3", e)} className={`flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-green-500/75 opacity-50 ${selectedGrade === "3" ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">4.</span>
                            Easy
                        </button>
                        <button onClick={(e) => handleButtonClick("4", e)} className={`flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-blue-500/75 opacity-50 ${selectedGrade === "4" ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">5.</span>
                            Perfect
                        </button>
                    </section>
                </section> : <span className="text-light">Loading</span>
            }
        </section>
    )
}

export default CardReview;