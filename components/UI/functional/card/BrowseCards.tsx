'use client'

import useGetCards from "@/hooks/card/useGetCards";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BrowseCards: React.FC = () => {
    const searchParams = useSearchParams();
    const deckId: number = Number(searchParams.get('deckId')) || 0;
    const [cards, setCards] = useState<Card[] | null>(null);

    useEffect(() => {
        // Get all cards
        const fetchCards = async () => {
            const results = await useGetCards(deckId)
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
            } else {
                console.error(`Error fetching cards: ${results.message}`);
            }
        }
        fetchCards();
    }, [deckId])

    return (
        <section className="h-full w-full">
            {
                cards && cards.map((card, index) => (
                    <section key={index} className="w-full p-2 border border-gray-200 rounded-md mb-2">
                        <h3 className="text-responsive-sm font-semibold">{card.front}</h3>
                        <p className="text-responsive-xs">{card.back}</p>
                    </section>
                ))
            }
        </section>
    );
}

export default BrowseCards;