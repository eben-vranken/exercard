'use client';

import DeckContent from "@/components/UI/functional/deck/DeckContent";
import { Suspense } from "react";

interface Deck {
    name: string;
    description: string;
}

const Deck: React.FC = () => {
    return (
        <Suspense fallback={<section>Loading...</section>}>
            <DeckContent />
        </Suspense>
    );
};

export default Deck;