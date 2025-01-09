'use client'

import useGetDueCards from "@/hooks/card/useGetDueCards";
import useReviewCard from "@/hooks/card/useReviewCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Toast from "../Toast";
import PostReviewAnalytics from "./PostReviewAnalytics";
import { useSettings } from "@/context/SettingsContext";

const formatNextReview = (nextReview: number | null) => {
    if (!nextReview) return '';

    const nextReviewDate = new Date(nextReview * 1000);
    const now = new Date();

    const diffInMs = nextReviewDate.getTime() - now.getTime();

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffInHours > 0) {
        return `Next review in ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}.`;
    } else if (diffInMinutes > 0) {
        return `Next review in ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}.`;
    } else {
        return `Next review in less than a minute.`;
    }
};

const CardReview: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';
    const reviewAlgorithm = searchParams.get('reviewAlgorithm') || '';
    const { settings, loading, error } = useSettings();

    const [flipped, setFlipped] = useState<boolean>(false);
    const [answered, setAnswered] = useState<boolean>(false);
    const [answeredAnimation, setAnsweredAnimation] = useState<string>('');
    const [cards, setCards] = useState<CardWithTags[]>([]);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [nextReview, setNextReview] = useState<number | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [showPostReviewAnalytics, setShowPostReviewAnalytics] = useState<boolean>(false);
    const [reviews, setReviews] = useState<CardWithTags[]>([]);

    useEffect(() => {
        const fetchDueCards = async () => {
            const results = await useGetDueCards(Number(deckId), Number(settings?.dailyCardLimit));
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
            } else {
                console.error(`Error fetching cards: ${results.message}`);
            }
        }
        fetchDueCards();
    }, [deckId, settings])

    const handleReview = async (grade: number) => {
        if (isTransitioning) return;

        console.log(cards[0]);

        try {
            const result = await useReviewCard(cards[0], Number(grade), reviewAlgorithm, Number(deckId));

            if (result.status === 'ok' && result.next_review) {
                setIsTransitioning(true);
                setAnswered(true);
                setAnsweredAnimation(`answered-${grade}`);
                setSelectedGrade(grade);
                setReviews((prevReviews) => [...prevReviews, { ...cards[0], grade }]);
                setNextReview(result.next_review);

            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAnimationEnd = () => {
        if (answered) {
            setCards(prevCards => {
                let newCards = [...prevCards];
                console.log(selectedGrade);
                if (Number(selectedGrade) < 4) {
                    const cardToMove = newCards.shift();
                    if (cardToMove) newCards.push(cardToMove);
                } else {
                    newCards = newCards.filter((_, index) => index !== 0);
                }

                if (newCards.length === 0) {
                    setShowPostReviewAnalytics(true)
                }

                return newCards;
            });

            setShowToast(false);
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

            const keyActions: { [key: string]: number } = {
                Digit1: 1,
                Digit2: 2,
                Digit3: 3,
                Digit4: 4,
                Digit5: 5,
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

    const handleButtonClick = (grade: number, event: React.MouseEvent<HTMLButtonElement>) => {
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
                    className="h-2 mx-auto bg-white/[3%] rounded-b border border-light transition-opacity duration-300"
                    style={{ opacity, width: `${width}%` }}
                />
            );
        }

        return layers;
    };

    useEffect(() => {
        if (answered && nextReview) {
            setShowToast(true);
        }
    }, [answered, nextReview]);

    return (
        <section className="h-full w-full flex flex-col items-center justify-center relative">
            {/* Toast */}
            {
                showToast && nextReview &&
                <Toast text={formatNextReview(nextReview)} position="top" />
            }

            {/* Reviewing cards */}
            {
                cards.length > 0 && <section className="h-full w-full flex flex-col items-center justify-around">
                    {/* Cards */}
                    <section className="w-full flex flex-col items-center justify-center relative">
                        <section className="w-3/5 ">
                            <h1 className="font-semibold text-light mb-3">
                                <span className="text-green-500 opacity-50">
                                    {cards.length}
                                </span>
                                &nbsp;
                                cards for review
                            </h1>
                        </section>

                        {/* Current card */}
                        <section className="w-3/5 flex flex-col">
                            <section
                                className={`
                                ${answeredAnimation} 
                                ${!answeredAnimation && !isTransitioning ? 'card-entry' : ''} 
                                border border-light rounded aspect-video flex flex-col gap-y-3 justify-center items-center px-5 overflow-hidden lg:text-lg xl:text-2xl text-center
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
                        <button onClick={(e) => handleButtonClick(1, e)} className={`flex gap-x-2 border border-light rounded hover:bg-white/5 p-2 text-red-500/75 opacity-50 ${selectedGrade === 1 ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">1.</span>
                            Again
                        </button>
                        <button onClick={(e) => handleButtonClick(2, e)} className={`flex gap-x-2 border border-light rounded hover:bg-white/5 p-2 text-orange-500/75 opacity-50 ${selectedGrade === 2 ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">2.</span>
                            Hard
                        </button>
                        <button onClick={(e) => handleButtonClick(3, e)} className={`flex gap-x-2 border border-light rounded hover:bg-white/5 p-2 text-yellow-500/75 opacity-50 ${selectedGrade === 3 ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">3.</span>
                            Normal
                        </button>
                        <button onClick={(e) => handleButtonClick(4, e)} className={`flex gap-x-2 border border-light rounded hover:bg-white/5 p-2 text-green-500/75 opacity-50 ${selectedGrade === 4 ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">4.</span>
                            Easy
                        </button>
                        <button onClick={(e) => handleButtonClick(5, e)} className={`flex gap-x-2 border border-light rounded hover:bg-white/5 p-2 text-blue-500/75 opacity-50 ${selectedGrade === 5 ? "bg-white/5 transition-colors duration-300" : ""}`}>
                            <span className="text-light">5.</span>
                            Perfect
                        </button>
                    </section>
                </section>
            }

            {/* Post review analytics */}
            {
                cards.length == 0 && showPostReviewAnalytics && <>
                    <PostReviewAnalytics reviews={reviews} deckId={Number(deckId)} />
                </>
            }
        </section>
    )
}

export default CardReview;