'use client';

import useCreateCard from "@/hooks/card/useCreateCard";
import useDeleteCard from "@/hooks/card/useDeleteCard";
import useGetCards from "@/hooks/card/useGetCards";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NewCard {
    deckId: number,
    front: string,
    back: string,
    tags: string[],
}

const AddCardComponent: React.FC = () => {
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';
    const [cards, setCards] = useState<Card[] | null>(null);
    const [animating, setAnimating] = useState(false);
    const [tagInput, setTagInput] = useState('');

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

    const [newCardData, setNewCardData] = useState<NewCard>({
        deckId: Number(deckId),
        front: '',
        back: '',
        tags: [],
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

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const normalizedTag = tagInput.trim().toLowerCase(); // Normalize for comparison
            
            // Check both length limit and uniqueness
            if (newCardData.tags.length >= 5) {
                alert("You cannot add more than 5 tags.");
                return;
            }
            
            if (newCardData.tags.map(tag => tag.toLowerCase()).includes(normalizedTag)) {
                alert("Tag must be unique.");
                return;
            }
            
            // If both checks pass, add the tag
            setNewCardData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        } else if (e.key === 'Backspace' && !tagInput) {
            e.preventDefault();
            setNewCardData(prev => ({
                ...prev,
                tags: prev.tags.slice(0, -1)
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
                    deckId: Number(deckId),
                    front: '',
                    back: '',
                    tags: []
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
                    {/* Front */}
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

                    {/* Back */}
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

                   {/* Tags */}
                   <section className="flex flex-col">
                        <section>
                            <label htmlFor="tags" className="text-sm text-light">Tags</label>
                        </section>
                        <section className="styled-input flex flex-wrap gap-2 min-h-[38px] items-center">
                            {newCardData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-white/10 px-2 py-1 rounded-full text-sm flex items-center gap-x-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewCardData(prev => ({
                                                ...prev,
                                                tags: prev.tags.filter((_, i) => i !== index)
                                            }));
                                        }}
                                        className="hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {newCardData.tags.length < 5 && (
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1 bg-transparent outline-none border-none placeholder:text-ultralight"
                                    placeholder={newCardData.tags.length === 0 ? "Type and press enter to add tags..." : ""}
                                />
                            )}
                        </section>
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
