'use client';

import Navbar from "@/components/UI/functional/Navbar"
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

interface Deck {
    name: string,
    description: string
}

const Deck: React.FC = () => {
    const searchParams = useSearchParams()
    const deckName = searchParams.get('deckName') || ''
    const pathname = usePathname();

    // Get the full query string
    const queryString = searchParams.toString();

    // Construct the full URL
    const fullUrl = `${window.location.origin}${pathname}${queryString ? `?${queryString}` : ''}`;
    console.log(fullUrl)

    const [deck, setDeck] = useState<Deck>()

    const fetchDeck = async () => {
        const results = await useGetSpecificDeck(deckName)

        if (results.status === 'ok') {
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


    }, [deckName])


    console.log(deck)
    return (
        <main className="w-full">
            <Navbar pageTitle={deck?.name} />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">{deck?.description}</h2>
                </section>
            </section>
        </main>
    )
}

export default Deck