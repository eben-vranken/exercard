'use client'

import useGetDecks from "@/hooks/deck/useGetDecks";
import { BaseDirectory, watch } from "@tauri-apps/plugin-fs";
import { Suspense, useEffect, useState } from "react";

import LoadingCircle from "../../static/LoadingCircle";
import CustomLink from "../CustomLink";

const DeckList: React.FC = () => {
    const [userDecks, setUserDecks] = useState<Deck[]>();

    const fetchDecks = async () => {
        const results = await useGetDecks()

        if (results.status === 'ok') {
            setUserDecks(results.decks)
        } else {
            console.error(results.message)
        }
    }

    const startWatcher = async () => {
        await watch(
            '',
            () => {
                fetchDecks()
            },
            { baseDir: BaseDirectory.AppData, delayMs: 10 }
        )
    }

    useEffect(() => {
        fetchDecks();
        startWatcher();
    }, [])

    if (!userDecks) return (
        < section className="flex justify-center items-center h-full gap-y-2 text-light" >
            <LoadingCircle />
        </section >
    )

    return (
        <section className="flex flex-col gap-y-2 text-light line-clamp-2" >


            {userDecks?.length > 0 ? <section>
                {
                    userDecks.map((deck, id) => {
                        return (<Suspense><CustomLink href={`/deck?deckId=${deck.id}`} key={id} content={deck.name.split('.')[0]} deckId={deck.id.toString()} deck></CustomLink></Suspense>)
                    })
                }
            </section> : <span>No decks</span>}

        </section >
    )
}

export default DeckList