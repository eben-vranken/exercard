'use client'

import useGetDecks from "@/hooks/filesystem/deck/useGetDecks";
import { BaseDirectory, DirEntry, watch } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import CustomLink from "./Link";

const DeckList: React.FC = () => {
    const [userDecks, setUserDecks] = useState<DirEntry[]>();

    const fetchDecks = async () => {
        const results = await useGetDecks()

        if (results.status === 'ok') {
            setUserDecks(results.decks)
        } else {
            console.error(results.message)
        }
    }

    const startWatcher = async () => {
        console.log('started watcher')
        await watch(
            'decks',
            (event) => {
                fetchDecks()
            },
            { baseDir: BaseDirectory.AppLocalData, delayMs: 500 }
        )
    }

    // This needs to be changed to a better refresh parameters.
    // Currently this 'loads' the decks every time the user goes to a different page.
    useEffect(() => {
        fetchDecks();
        startWatcher();
    }, [])



    if (!userDecks) return (
        < section className="flex flex-col gap-y-2 text-light" >
            <p>Loading decks...</p>
        </section >
    )

    return (
        <section className="flex flex-col gap-y-2 text-light" >
            {userDecks?.length > 0 ? <section>
                {
                    userDecks.map((deck, id) => {
                        return (<CustomLink href={`/deck?deckName=${deck.name}`} key={id} content={deck.name.split('.')[0]}></CustomLink>)
                    })
                }
            </section> : <span>No decks</span>}
        </section >
    )
}

export default DeckList