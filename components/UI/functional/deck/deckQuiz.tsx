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

interface ReviewProps {
    cards: Card[];
}

const CardReview: React.FC<ReviewProps> = ({ cards }) => {
    const [answered, setAnswered] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                setAnswered(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <section className="w-full h-full flex flex-col items-center justify-around p-5">
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
            <section className={`flex gap-x-2 font-semibold ${answered ? "" : "opacity-0"}`}>
                <button className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-red-500/75 opacity-50">
                    <span className="text-light">0.</span>
                    Again
                </button>
                <button className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-orange-500/75 opacity-50">
                    <span className="text-light">1.</span>
                    Hard
                </button>
                <button className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-yellow-500/75 opacity-50">
                    <span className="text-light">2.</span>
                    Normal
                </button>
                <button className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-green-500/75 opacity-50">
                    <span className="text-light">3.</span>
                    Easy
                </button>
                <button className="flex gap-x-2 border border-white/5 rounded hover:bg-white/5 p-2 text-blue-500/75 opacity-50">
                    <span className="text-light">4.</span>
                    Perfect
                </button>
            </section>
        </section>
    )
}

export default CardReview;