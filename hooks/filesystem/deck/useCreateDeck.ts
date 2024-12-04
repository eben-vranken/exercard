import { exists, create, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs"

interface Deck {
    name: string;
    description: string;
}

const useCreateDeck = async ({ name, description }: Deck): Promise<{ status: string, message: string }> => {
    try {
        // Check if decks folder exists
        const decksDirExists = await exists('decks', {
            baseDir: BaseDirectory.AppLocalData,
        })

        if (!decksDirExists) {
            await mkdir('decks', {
                baseDir: BaseDirectory.AppLocalData
            })
        }

        const file = await create(`decks/${name}.json`, { baseDir: BaseDirectory.AppLocalData });
        await file.write(new TextEncoder().encode(JSON.stringify({ name, description })));
        await file.close();


        return { status: 'ok', message: 'Deck created successfully.' }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to create deck: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred.' }
    }
}

export default useCreateDeck