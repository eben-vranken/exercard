'use client';

import useCreateCard from "@/hooks/filesystem/card/useCreateCard";
import useGetCards from "@/hooks/filesystem/card/useGetCards";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Card {
    deckId: number;
    front: string;
    back: string;
    hint?: string;
}

const AddCardComponent: React.FC = () => {
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';
    const [cards, setCards] = useState<Card[] | null>(null);

    // Get cards of deck once deck is fetched
    useEffect(() => {
        const fetchCards = async () => {
            if (deckId) {
                const results = await useGetCards(Number(deckId))
                if (results.status === 'ok' && results.data) {
                    setCards(results.data);
                } else {
                    console.error(`Error fetching deck: ${results.message}`);
                }
            }
        }
        fetchCards();
    }, [deckId])

    const [newCardData, setNewCardData] = useState<Card>({
        deckId: Number(deckId),
        front: '',
        back: '',
        hint: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;

        // Map input names to Card interface keys
        const fieldMap: { [key: string]: keyof Card } = {
            'front': 'front',
            'back': 'back',
            'hint': 'hint'
        };

        const field = fieldMap[name];
        if (field) {
            setNewCardData((prev) => ({
                ...prev,
                [field]: value,
            }))
        }
    }

    const firstInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await useCreateCard(newCardData);

            if (result.status == "ok") {
                setNewCardData({
                    deckId: Number(deckId),
                    front: '',
                    back: '',
                    hint: ''
                });

                const updatedCards = await useGetCards(Number(deckId));
                if (updatedCards.status === 'ok' && updatedCards.data) {
                    setCards(updatedCards.data);
                }

                firstInputRef.current?.focus();
            } else {
                console.error(result.message)
            }

        } catch (err: unknown) {
            console.error('Unexpected error when creating card: ', err)
        }
    }

    return (
        <section className="h-full w-full flex overflow-hidden justify-between">
            <section className="w-full flex items-center justify-center">
                {/* New Card Details */}
                <form className="flex flex-col w-1/3 justify-center items-center gap-y-3 [&>*]:gap-y-1 [&>*]:w-full" onSubmit={handleSubmit}>
                    {/* Card front */}
                    <section className="flex flex-col">
                        <section>
                            <label htmlFor="front" className="text-sm text-light">Front</label>
                            <span className="text-red-600 opacity-75">
                                &nbsp;*
                            </span>
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

                    {/* Card back */}
                    <section className="flex flex-col">
                        <section>
                            <label htmlFor="back" className="text-sm text-light">Back</label>
                            <span className="text-red-600 opacity-75">
                                &nbsp;*
                            </span>
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

                    {/* Card hint */}
                    <section className="flex flex-col">
                        <label htmlFor="hint" className="text-sm text-light">Hint</label>
                        <input
                            type="text"
                            name="hint"
                            id="hint"
                            className="styled-input"
                            onChange={handleChange}
                            value={newCardData.hint}
                        />
                    </section>

                    <section className="w-full md:w-2/3 text-ultralight flex text-xs">
                        <span className="text-red-600 opacity-75">
                            *
                        </span>
                        <span>Required</span>
                    </section>

                    <section>
                        <button type="submit" className="styled-button">Add</button>
                    </section>
                </form>
            </section>

            {/* Existing Card List */}
            <section className={`w-1/3 h-full overflow-y-auto ${cards?.length === 0 && 'flex items-center justify-center'}`} >
                {cards?.length ? <section className="flex flex-col gap-y-2 ">
                    {cards.map((card, id) => {
                        return (
                            <section key={id} className="flex flex-col border border-white/10 rounded p-1">
                                <span className="text-light">
                                    {card.front}
                                </span>
                                <span className="text-ultralight">
                                    {card.back}
                                </span>
                            </section>
                        )
                    })}
                </section> : <span className="text-light">No cards yet!</span>}
            </section>
        </section>
    )
}

export default AddCardComponent;