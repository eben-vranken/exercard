'use client'

import { useState } from "react"
import useCreateDeck from "@/hooks/filesystem/deck/useCreateDeck";
import { useRouter } from 'next/navigation';

// Compontents
import Navbar from "@/components/UI/functional/Navbar"

interface DeckData {
    name: string;
    description: string;
}

const CreateManual: React.FC = () => {
    const [deckData, setDeckData] = useState<DeckData>({ name: '', description: '' })
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;

        setDeckData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // eslint-disable-next-line no-use-before-define
            const result = await useCreateDeck(deckData);

            if (result.status == "ok") {
                router.push(`/deck?deckId=${result.deckId}`);
            } else {
                console.error(result.message)
            }

        } catch (err: unknown) {
            console.error('Unexpected error when creating deck: ', err)
        }
    }

    return (
        <main className="w-full flex flex-col">
            <Navbar />

            <section className="p-[10px] h-full flex flex-col ">
                <section className="mb-2">
                    <h2 className="text-responsive-md font-semibold">Create manually</h2>
                    <p className="text-responsive-sm text-light">
                        Customize every detail of your deck by adding cards yourself.
                    </p>
                </section>

                <form className="h-full w-full flex flex-col gap-y-2 items-center justify-center" autoComplete="off" onSubmit={handleSubmit}>
                    <section className="flex flex-col w-full md:w-2/3 gap-y-1">
                        <section>
                            <span className="text-sm text-light">Deck name</span>
                            <span className="text-red-600 opacity-75">
                                &nbsp;*
                            </span>
                        </section>
                        <input type="text" className="styled-input" name="name" value={deckData.name} onChange={handleChange} required ></input>
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
                        <button type="submit" className="styled-button">Create</button>
                    </section>
                </form>
            </section>
        </main>
    )
}

export default CreateManual