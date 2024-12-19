interface Card {
    id: Number;
    deckId: number;
    front: string;
    back: string;
    retrievability: number;
    stability: number;
    difficulty: number;
}

interface ReviewProps {
    cards: Card[];
}

const CardReview: React.FC<ReviewProps> = ({ cards }) => {
    return (
        <section className="h-full">
            <h1 className="font-semibold text-light">
                <span className="text-green-500 opacity-50">
                    {cards.length}
                </span>
                &nbsp;
                cards for review</h1>
        </section>
    )
}

export default CardReview;