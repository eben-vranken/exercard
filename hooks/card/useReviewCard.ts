interface UseGetCardsResponse {
    status: 'ok' | 'error';
    card?: Card;
    message?: string;
}

interface ReviewProps {
    card: Card;
    grade: number;
}

const useReviewCard = async (card: Card, grade: number): Promise<UseGetCardsResponse> => {
    return { status: "ok" }
}

export default useReviewCard;