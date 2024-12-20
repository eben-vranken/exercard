interface UseGetCardsResponse {
    status: 'ok' | 'error';
    data?: {
        retrievability: number;
        stability: number;
        difficulty: number;
    }
    message?: string;
}

const useReviewCard = async (grade: string): Promise<UseGetCardsResponse> => {
    return { status: "ok" }
}

export default useReviewCard;