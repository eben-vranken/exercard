'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Deck {
    name: string;
    description: string;
}

function DeckContent() {
    const searchParams = useSearchParams();
    const [deck, setDeck] = useState<Deck | null>(null);
    const deckName = searchParams.get('deckName') || '';

    useEffect(() => {
        const fetchDeck = async () => {
            if (deckName) {
                const results = await useGetSpecificDeck(deckName);
                if (results.status === 'ok' && results.deck) {
                    setDeck(results.deck);
                } else {
                    console.error(`Error fetching deck: ${results.message}`);
                }
            }
        };
        fetchDeck();
    }, [deckName]);

    if (!deck) {
        return <section>Loading...</section>;
    }

    return (
        <main className="w-full">
            <Navbar pageTitle={deck.name} />
            <section className="p-[10px] h-full flex flex-col">
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">{deck.description}</h2>
                </section>
            </section>
        </main>
    );
}

export default DeckContent;