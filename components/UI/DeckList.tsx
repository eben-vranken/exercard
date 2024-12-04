import useGetDecks from "@/hooks/filesystem/deck/useGetDecks";
import { DirEntry } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import CustomLink from "./functional/Link";


const DeckList: React.FC = () => {
    const [userDecks, setUserDecks] = useState<DirEntry[]>();

    const fetchDecks = async () => {
        const results = await useGetDecks()

        if (results.status === 'ok') {
            console.log(results.decks)
            setUserDecks(results.decks)
            console.log(userDecks)
        } else {
            console.error(results.message)
        }
    }

    // This needs to be changed to a better refresh parameters.
    // Currently this 'loads' the decks every time the user goes to a different page.
    useEffect(() => {
        fetchDecks()
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
                        return (<CustomLink href={`deck?deck=${deck.name.split('.')[0]}`} key={id} content={deck.name.split('.')[0]}></CustomLink>)
                    })
                }
            </section> : <span>No decks</span>}
        </section >
    )
}

export default DeckList