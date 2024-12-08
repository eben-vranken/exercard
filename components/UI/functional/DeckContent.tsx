'use client';

import Navbar from "@/components/UI/functional/Navbar";
import useGetSpecificDeck from "@/hooks/filesystem/deck/useGetSpecificDeck";
import { Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import useDeleteDeck from "@/hooks/filesystem/deck/useDeleteDeck";

interface Deck {
    id: number;
    name: string;
    description: string;
}

function DeckContent() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [deck, setDeck] = useState<Deck | null>(null);
    const deckName = searchParams.get('deckName') || '';

    // Deck states
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState<{
        isVisible: boolean;
        resolve?: (value: boolean) => void;
    }>({ isVisible: false });

    // Get deck
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


    // Edit deck
    const editDeck = () => {
        setIsEditing(true);
    }

    // Delete deck
    const handleDeleteDeck = async () => {
        const userConfirmed = await showConfirmModal();
        if (userConfirmed) {
            console.log("Deck deleted!");

            if (deck) {
                const result = await useDeleteDeck(deck);

                console.log(result)
                if (result.status === "ok") {
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
        <main className="w-full">
            <Navbar />
            <section className="p-[10px] h-full flex flex-col">
                {
                    deck ?
                        <section>
                            {/* Deck Editing */}
                            {
                                isEditing
                            }

                            {
                                isDeleting.isVisible && <ConfirmModal
                                    title="Confirm deletion"
                                    description="Once a deck is deleted, it cannot be revived."
                                    onClose={(result) => {
                                        isDeleting.resolve?.(result);
                                        setIsDeleting({ isVisible: false });
                                    }}
                                />
                            }

                            <section className="flex items-center justify-between gap-x-4 w-full mb-2">
                                <section className="flex flex-col">
                                    <h2 className="text-responsive-md font-semibold">{deck.name}</h2>
                                    <p className="text-responsive-sm text-light">
                                        {deck.description}
                                        <span className="invisible">
                                            {'template'}
                                        </span>
                                    </p>
                                </section>

                                {/* Deck options */}
                                <section className="flex gap-x-2 items-center">
                                    <section className="gap-x-2 bg-[#F4AC45] rounded py-1 px-2 cursor-pointer hover:opacity-75" onClick={() => editDeck()}>
                                        <Pencil size={25} />
                                    </section>
                                    <section className="gap-x-2 bg-[#D1462F] rounded py-1 px-2 cursor-pointer hover:opacity-75" onClick={() => handleDeleteDeck()}>
                                        <Trash size={25} />
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
        </main>
    );
}

export default DeckContent;