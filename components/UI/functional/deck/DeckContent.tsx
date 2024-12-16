'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { Pencil, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import useDeleteDeck from "@/hooks/filesystem/deck/useDeleteDeck";
import useGetCards from "@/hooks/filesystem/card/useGetCards";
import Link from "next/link";

interface Deck {
    id: number;
    name: string;
    description: string;
}

interface Card {
    deckId: number;
    front: string;
    back: string;
    hint?: string;
}


function DeckContent() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';

    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<Card[] | null>(null);

    // Deck states
    const [isDeleting, setIsDeleting] = useState<{
        isVisible: boolean;
        resolve?: (value: boolean) => void;
    }>({ isVisible: false });

    // Get deck
    useEffect(() => {
        const fetchDeck = async () => {
            if (deckId) {
                const results = await useGetSpecificDeck(deckId);
                if (results.status === 'ok' && results.deck) {
                    setDeck(results.deck);
                } else {
                    console.error(`Error fetching deck: ${results.message}`);
                }
            }
        };
        fetchDeck();
    }, [deckId]);

    // Get cards of deck once deck is fetched
    useEffect(() => {
        const fetchCards = async () => {
            if (deck) {
                const results = await useGetCards(deck.id)
                if (results.status === 'ok' && results.data) {
                    setCards(results.data);
                } else {
                    console.error(`Error fetching deck: ${results.message}`);
                }
            }
        }
        fetchCards();
    }, [deck])

    // Create cards
    const createCards = () => {

    }

    // Delete deck
    const handleDeleteDeck = async () => {
        const userConfirmed = await showConfirmModal();
        if (userConfirmed) {

            if (deck) {
                const result = await useDeleteDeck(deck);

                console.log(result)
                if (result.status === "ok") {
                    console.log("Deck deleted!");
                    router.push('/')
                }
            }
        } else {
            console.log("Deletion cancelled.");
        }
    };

    const showConfirmModal = () => {
        return new Promise<boolean>((resolve) => {
            setIsDeleting({ isVisible: true, resolve });
        });
    };
    return (
        <main className="w-full flex flex-col relative">
            <Navbar />
            <section className="p-[10px] h-full flex flex-col">
                {
                    deck && cards ?
                        <section className="flex gap-2 h-full">
                            {
                                isDeleting.isVisible && <ConfirmModal
                                    title="Confirm deletion"
                                    description="Once a deck is deleted, it cannot be restored."
                                    onClose={(result) => {
                                        isDeleting.resolve?.(result);
                                        setIsDeleting({ isVisible: false });
                                    }}
                                />
                            }

                            <section className="flex flex-col justify-between w-full mb-2">
                                <section className="flex items-center justify-between ">
                                    <section className="flex flex-col">
                                        <h2 className="text-responsive-md font-semibold">{deck.name}</h2>
                                        <p className="text-responsive-sm text-light">
                                            {deck.description ? deck.description :
                                                < span className="text-ultralight">
                                                    No description
                                                </span>
                                            }
                                        </p>
                                    </section>

                                    {/* Deck options */}
                                    <section className="flex gap-x-2 opacity-75">
                                        <Link href={`/add-cards?deckId=${deck.id}`} className="gap-x-2 bg-[#7FB069] rounded py-1 px-2 cursor-pointer hover:opacity-75" onClick={() => createCards()}>
                                            <Plus size={25} />
                                        </Link>
                                        <Link href={`/edit-deck?deckId=${deck.id}`} className="gap-x-2 bg-[#F4AC45] rounded py-1 px-2 cursor-pointer hover:opacity-75">
                                            <Pencil size={25} />
                                        </Link>
                                        <section className="gap-x-2 bg-[#D1462F] rounded py-1 px-2 cursor-pointer hover:opacity-75" onClick={() => handleDeleteDeck()}>
                                            <Trash size={25} />
                                        </section>
                                    </section>
                                </section>


                                {/* Main deck */}
                                <section className="flex flex-col items-center w-full h-full">
                                    {/* Cards */}
                                    <section className="h-full flex items-center justify-center">
                                        {
                                            cards?.length > 0 ?
                                                <section>

                                                </section>
                                                :
                                                <span className="text-light">No cards yet!</span>
                                        }
                                    </section>

                                    {/* Activities */}
                                    <section className="h-[100px] w-full md:w-2/3 flex flex-col md:flex-row gap-x-1 text-light">
                                        <section className="flex flex-1 items-center justify-center border border-white/5 rounded hover:bg-white/[1%] cursor-pointer">Quiz Me</section>
                                        <section className="flex flex-1 items-center justify-center border border-white/5 rounded hover:bg-white/[1%] cursor-pointer">Let's Talk</section>
                                        <section className="flex flex-1 items-center justify-center border border-white/5 rounded hover:bg-white/[1%] cursor-pointer">Explain It</section>
                                    </section>
                                </section>
                            </section>
                        </section>
                        :
                        <section>
                            Loading...
                        </section>
                }
            </section>
        </main >
    );
}

export default DeckContent;