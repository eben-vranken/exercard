'use client';

import useCreateCard from "@/hooks/card/useCreateCard";
import useDeleteCard from "@/hooks/card/useDeleteCard";
import useGetCards from "@/hooks/card/useGetCards";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const AddCardComponent: React.FC = () => {
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';
    const [cards, setCards] = useState<Card[] | null>(null);
    const [animating, setAnimating] = useState(false);

    const fetchCards = async () => {
        if (deckId) {
            const results = await useGetCards(Number(deckId));
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
            } else {
                console.error(`Error fetching deck: ${results.message}`);
            }
        }
    };

    useEffect(() => {
        fetchCards();
    }, [deckId]);

    const [newCardData, setNewCardData] = useState<Card>({
        id: Number(null),
        deckId: Number(deckId),
        front: '',
        back: '',
        retrievability: 0,
        stability: 0,
        difficulty: 0,
        repetition: 0,
        interval: 0,
        easiness_factor: 0,
        grade: 0,
        next_review: new Date(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        const fieldMap: { [key: string]: keyof Card } = {
            'front': 'front',
            'back': 'back',
        };
        const field = fieldMap[name];
        if (field) {
            setNewCardData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const firstInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await useCreateCard(newCardData);

            if (result.status == "ok") {
                setNewCardData({
                    id: Number(null),
                    deckId: Number(deckId),
                    front: '',
                    back: '',
                    retrievability: 0,
                    stability: 0,
                    difficulty: 0,
                    repetition: 0,
                    interval: 0,
                    easiness_factor: 0,
                    grade: 0,
                    next_review: new Date()
                });

                // Add animation trigger for the new card
                setAnimating(true);

                const updatedCards = await useGetCards(Number(deckId));
                if (updatedCards.status === 'ok' && updatedCards.data) {
                    setCards(updatedCards.data);
                }

                firstInputRef.current?.focus();
            } else {
                console.error(result.message);
            }

        } catch (err: unknown) {
            console.error('Unexpected error when creating card: ', err);
        }
    };

    const handleDelete = async (cardId: Number) => {
        const result = await useDeleteCard(cardId);

        console.log(result);
        if (result.status === "ok") {
            console.log("Card Deleted");
            fetchCards();
        } else {
            console.log("Deletion cancelled.");
        }
    };

    return (
        <section className="h-full w-full flex overflow-hidden justify-between">
            <section className="w-full flex items-center justify-center">
                {/* New Card Details */}
                <form className="flex flex-col w-1/3 justify-center items-center gap-y-3 [&>*]:gap-y-1 [&>*]:w-full" onSubmit={handleSubmit}>
                    <section className="flex flex-col">
                        <section>
                            <label htmlFor="front" className="text-sm text-light">Front</label>
                            <span className="text-red-600 opacity-75">&nbsp;*</span>
                        </section>
                        <input
                            ref={firstInputRef}
                            type="text"
                            name="front"
                            id="front"
                            className="styled-input"
                            onChange={handleChange}
                            value={newCardData.front}
                            required
                        />
                    </section>

                    <section className="flex flex-col">
                        <section>
                            <label htmlFor="back" className="text-sm text-light">Back</label>
                            <span className="text-red-600 opacity-75">&nbsp;*</span>
                        </section>
                        <input
                            type="text"
                            name="back"
                            id="back"
                            className="styled-input"
                            onChange={handleChange}
                            value={newCardData.back}
                            required
                        />
                    </section>

                    <section className="w-full md:w-2/3 text-ultralight flex text-xs">
                        <span className="text-red-600 opacity-75">*</span>
                        <span>Required</span>
                    </section>

                    <section>
                        <button type="submit" className="styled-button">Add</button>
                    </section>
                </form>
            </section>

            {/* Existing Card List */}
            <section className={`w-1/3 h-full overflow-y-auto card-list ${cards?.length === 0 && 'flex items-center justify-center'}`}>
                {cards?.length ? (
                    <section className="flex flex-col-reverse gap-y-2">
                        {cards.map((card, id) => (
                            <section key={id} className={`flex justify-between items-center border border-white/10 rounded p-1 card-entry`}>
                                <section className="flex flex-col w-3/4 ">
                                    <span className="text-light line-clamp-2">{card.front}</span>
                                    <span className="text-ultralight line-clamp-2">{card.back}</span>
                                </section>


                                <section className="flex flex-col gap-y-3">
                                    <Pencil size={25} className="text-light hover:text-ultralight cursor-pointer" />
                                    <Trash size={25} className="text-light hover:text-ultralight cursor-pointer" onClick={() => handleDelete(card.id)} />
                                </section>
                            </section>
                        ))}
                    </section>
                ) : (
                    <span className="text-light">No cards yet!</span>
                )}
            </section>
        </section>
    );
};

export default AddCardComponent;
