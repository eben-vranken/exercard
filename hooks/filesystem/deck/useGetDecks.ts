import { readDir, BaseDirectory, DirEntry } from '@tauri-apps/plugin-fs'

const useGetDecks = async (): Promise<{ status: string, decks?: DirEntry[], message?: string }> => {
    try {
        const entries = await readDir('decks', { baseDir: BaseDirectory.AppLocalData })
        console.log(entries)
        return { status: 'ok', decks: entries }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch decks: ${err.message}` }
        }
        return { status: 'error', message: 'An unknown error occurred.' }
    }
}

export default useGetDecks