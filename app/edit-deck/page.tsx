'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useEditDeck from "@/hooks/filesystem/deck/useEditDeck";
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DeckData {
    name: string;
    description: string;
}

const EditDeck: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';
    const [deckData, setDeckData] = useState<DeckData>({ name: '', description: '' })

    const [deck, setDeck] = useState<Deck | null>(null);

    // Get deck
    useEffect(() => {
        const fetchDeck = async () => {
            if (deckId) {
                const results = await useGetSpecificDeck(deckId);
                if (results.status === 'ok' && results.deck) {
                    setDeck(results.deck);
                    setDeckData({
                        name: results.deck.name || '',
                        description: results.deck.description || ''
                    });
                } else {
                    console.error(`Error fetching deck: ${results.message}`);
                }
            }
        };
        fetchDeck();
    }, [deckId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;

        setDeckData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await useEditDeck({
            id: Number(deckId), // Ensure deckId is passed as a number
            name: deckData.name,
            description: deckData.description,
        });

        if (response.status === 'ok') {
            console.log(response.message);
            router.push(`/deck?deckId=${deck?.id}`);
        } else {
            console.error(response.message);
        }
    };


    return (
        <main className="w-full flex flex-col">
            <Navbar />

            <section className="p-[10px] h-full flex flex-col">
                {/* Welcome message */}
                <section className="mb-2 ">
                    <h2 className="text-responsive-md font-semibold">Edit your deck</h2>
                    <p className="text-responsive-sm text-light">
                        Ready for a change?
                    </p>
                </section>

                {/* Deck Content */}
                <form className="h-full w-full flex flex-col gap-y-2 items-center justify-center" onSubmit={handleSubmit}>
                    <section className="flex flex-col w-full md:w-2/3 gap-y-1">
                        <section>
                            <span className="text-sm text-light">Deck name</span>
                            <span className="text-red-600 opacity-75">
                                &nbsp;*
                            </span>
                        </section>
                        <input className="styled-input" name="name" value={deckData.name} onChange={handleChange} required></input>
                    </section>

                    <section className="flex flex-col w-full md:w-2/3 gap-y-1">
                        <span className="text-sm text-light">Deck description</span>
                        <textarea className="styled-input" rows={10} value={deckData.description} name="description" onChange={handleChange}></textarea>
                    </section>

                    <section className="w-full md:w-2/3 text-ultralight flex text-xs">
                        <span className="text-red-600 opacity-75">
                            *
                        </span>
                        <span>Required</span>
                    </section>

                    <section className="w-full md:w-2/3">
                        <button type="submit" className="styled-button">Edit</button>
                    </section>
                </form>
            </section>
        </main >
    )
}

export default EditDeck;