'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useGetSpecificDeck from "@/hooks/deck/useGetSpecificDeck";
import { BookBookmark, Pencil, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import useDeleteDeck from "@/hooks/deck/useDeleteDeck";
import useGetCards from "@/hooks/card/useGetCards";
import Link from "next/link";
import useGetDueCards from "@/hooks/card/useGetDueCards";

function DeckContent() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deckId') || '';

    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<Card[] | null>(null);
    const [dueCards, setDueCards] = useState<Card[] | null>(null);

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
        // Get all cards
        const fetchCards = async () => {
            if (deck) {
                const results = await useGetCards(deck.id)
                if (results.status === 'ok' && results.data) {
                    setCards(results.data);
                } else {
                    console.error(`Error fetching cards: ${results.message}`);
                }
            }
        }
        fetchCards();

        const fetchDueCards = async () => {
            if (deck) {
                const results = await useGetDueCards(deck.id)
                if (results.status === 'ok' && results.data) {
                    setDueCards(results.data);
                } else {
                    console.error(`Error fetching cards: ${results.message}`);
                }
            }

        }
        fetchDueCards();
    }, [deck])

    // Delete deck
    const handleDeleteDeck = async () => {
        const userConfirmed = await showConfirmModal();
        if (userConfirmed) {

            if (deck) {
                const result = await useDeleteDeck(deck);

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
        <main className="w-full h-full flex flex-col relative">
            <Navbar />
            <section className="p-[10px] w-full h-full flex flex-col">
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

                            <section className="flex flex-col justify-between w-full gap-y-10">
                                {/* Deck navbar */}
                                <section className="flex items-center justify-between ">
                                    <section className="flex flex-col">
                                        <h2 className="text-responsive-md font-semibold line-clamp-1">{deck.name}</h2>
                                        <p className="text-responsive-sm text-light line-clamp-3">
                                            {deck.description ? deck.description :
                                                < span className="text-ultralight">
                                                    No description
                                                </span>
                                            }
                                        </p>
                                    </section>

                                    {/* Deck options */}
                                    <section className="flex gap-x-4 opacity-75">
                                        <Link href={`/add-cards?deckId=${deck.id}`} className="cursor-pointer hover:opacity-75">
                                            <Plus size={25} />
                                        </Link>
                                        <Link href={`/browse-cards?deckId=${deck.id}`} className="cursor-pointer hover:opacity-75">
                                            <BookBookmark size={25} />
                                        </Link>
                                        <Link href={`/edit-deck?deckId=${deck.id}`} className="cursor-pointer hover:opacity-75">
                                            <Pencil size={25} />
                                        </Link>
                                        <section className="cursor-pointer hover:opacity-75" onClick={() => handleDeleteDeck()}>
                                            <Trash size={25} />
                                        </section>
                                    </section>
                                </section>


                                {/* Main deck */}
                                <section className="flex flex-col items-center w-full h-full">
                                    {/* Cards */}
                                    <section className="h-full w-full flex items-center justify-center">
                                        {
                                            (cards.length > 0) ?
                                                (
                                                    dueCards && dueCards?.length > 0 ?
                                                        // Cards to review
                                                        <Link href={`/review?deckId=${deck.id}&reviewAlgorithm=${deck.algorithm}`} className="cursor-pointer">
                                                            <section className="flex flex-col items-center justify-center border border-light rounded hover:bg-white/[1%] cursor-pointer p-3">
                                                                <h2 className="text-light">Review Cards</h2>
                                                                <span className="text-ultralight text-sm">You have {dueCards.length} cards due!</span>
                                                            </section>
                                                        </Link>
                                                        :
                                                        <span className="text-light">No cards due!</span>
                                                )
                                                :
                                                <span className="text-light">Deck doesn't have cards yet!</span>
                                        }
                                    </section>


                                    {/* Activities */}
                                    <section className="h-[100px] w-full md:w-2/3 flex flex-col md:flex-row gap-x-1 text-light">
                                        <section className="flex flex-1 items-center justify-center border border-light rounded hover:bg-white/[1%] cursor-pointer">Quiz Me</section>
                                        <section className="flex flex-1 items-center justify-center border border-light rounded hover:bg-white/[1%] cursor-pointer">Let's Talk</section>
                                        <section className="flex flex-1 items-center justify-center border border-light rounded hover:bg-white/[1%] cursor-pointer">Explain It</section>
                                    </section>
                                </section>
                            </section>
                        </section>
                        :
                        <span className="text-light">
                            Loading...
                        </span>
                }
            </section>
        </main >
    );
}

export default DeckContent;