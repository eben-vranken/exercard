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
    const [filteredCards, setFilteredCards] = useState<CardWithTags[] | null>(null);
    const [filterText, setFilterText] = useState<string>('');

    useEffect(() => {
        const fetchCards = async () => {
            const results = await useGetCardsWithTags(deckId);
            if (results.status === 'ok' && results.data) {
                setCards(results.data);
                setFilteredCards(results.data);
            } else {
                console.error(`Error fetching cards: ${results.message}`);
            }
        }
        fetchCards();
    }, [deckId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!cards) return;

        e.preventDefault();
        const filter = e.target.value.toLowerCase();
        setFilterText(e.target.value);
        setFilteredCards(
            cards.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(filter)
                )
            )
        );
    }

    return (
        <section className="h-full w-full flex flex-col gap-y-2 overflow-y-scroll pb-10">
            {cards ? (
                <>
                    <section className="flex flex-col w-min">
                        <input type="text" id="card-search" className="styled-input placeholder:text-white/20" placeholder="Search..." value={filterText} onChange={handleChange} />
                    </section>
                    <table>
                        < thead >
                            <tr>
                                <th className="border border-light px-4 py-2 text-left">Front</th>
                                <th className="border border-light px-4 py-2 text-left">Back</th>
                                <th className="border border-light px-4 py-2 text-left">Tags</th>
                            </tr>
                        </thead >
                        <tbody>
                            {filteredCards?.map((card, index) => (
                                <tr key={index} className="hover:bg-white/5 [&>*]:p-2 [&>*]:overflow-ellipsis cursor-pointer">
                                    <td className="border border-light">{card.front}</td>
                                    <td className="border border-light">{card.back}</td>
                                    <td className="border border-light">
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
                </>
            ) : (
                <p className="text-center text-white">Loading cards...</p>
            )}
        </section >
    );
}

export default BrowseCards;