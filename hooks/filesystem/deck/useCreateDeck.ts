interface Deck {
    name: string;
    description: string;
}

const useCreateDeck = ({ name, description }: Deck) => {
    console.log(name, description)
}

export default useCreateDeck