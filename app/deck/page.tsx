'use client';

import Navbar from "@/components/UI/functional/Navbar"
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

interface Deck {
    name: string,
    description: string
}

const Decks: React.FC = () => {
    const searchParams = useSearchParams()
    const deckName = searchParams.get('deckName') || ''

    const [deck, setDeck] = useState<Deck>()

    const fetchDeck = async () => {
        const results = await useGetSpecificDeck(deckName)

        if (results.status === 'ok') {
            console.log(results.deck)
            if (results.deck) {
                const jsonDeck = JSON.parse(results.deck)
                setDeck(jsonDeck)
            }
        } else {
            console.error(results.message)
        }
    }

    useEffect(() => {
        fetchDeck()
    }, [])


    console.log(deck)
    return (
        <main className="w-full">
            <Navbar />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">{deck?.name}</h2>
                    <p className="text-responsive-sm text-light">
                        {deck?.description}
                    </p>
                </section>


            </section>
        </main>
    )
}

export default Decks