'use client'
import useGetCardsWithTags from "@/hooks/card/useGetCardsWithTags";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CardWithTags extends Card {
    tags: { id: number; name: string; }[];
}

const BrowseCards: React.FC = () => {
    const searchParams = useSearchParams();
    const deckId: number = Number(searchParams.get('deckId')) || 0;
    const [cards, setCards] = useState<CardWithTags[] | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            const results = await useGetCardsWithTags(deckId);
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
            } else {
                console.error(`Error fetching cards: ${results.message}`);
            }
        }
        fetchCards();
    }, [deckId]);

    return (
        <section className="h-full w-full flex flex-col overflow-y-scroll pb-10">
            {cards ? (
                <table>
                    < thead >
                        <tr>
                            <th className="border border-white/10 px-4 py-2 text-left">Front</th>
                            <th className="border border-white/10 px-4 py-2 text-left">Back</th>
                            <th className="border border-white/10 px-4 py-2 text-left">Tags</th>
                        </tr>
                    </thead >
                    <tbody>
                        {cards.map((card, index) => (
                            <tr key={index} className="hover:bg-white/5 [&>*]:p-2 [&>*]:overflow-ellipsis">
                                <td className="border border-white/10">{card.front}</td>
                                <td className="border border-white/10">{card.back}</td>
                                <td className="border border-white/10">
                                    <section className="flex gap-1 w-full">
                                        {card.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="bg-white/10 text-sm px-2 py-1 rounded-md"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </section>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            ) : (
                <p className="text-center text-white">Loading cards...</p>
            )}
        </section >
    );
}

export default BrowseCards;