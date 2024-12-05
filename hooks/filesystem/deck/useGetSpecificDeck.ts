import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";

const useGetSpecificDeck = async (deckName: string) => {
    try {
        console.log(deckName)

        const deck = await readTextFile(`decks/${deckName}`, {
            baseDir: BaseDirectory.AppLocalData,
        });


        return { status: 'ok', deck: deck }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch decks: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred.' }
    }
}

export default useGetSpecificDeck