'use client';

import Navbar from "@/components/UI/functional/Navbar"
import { useSearchParams } from "next/navigation"

const Decks: React.FC = () => {
    const searchParams = useSearchParams()
    const deck = searchParams.get('deck')

    console.log(deck)
    return (
        <main className="w-full">
            <Navbar pageTitle={deck || ''} />
        </main>
    )
}

export default Decks