import { create, BaseDirectory } from "@tauri-apps/plugin-fs"

interface Deck {
    name: string;
    description: string;
}

const useCreateDeck = async ({ name, description }: Deck) => {
    const file = await create(`${name}.json`, { baseDir: BaseDirectory.AppLocalData });
    await file.write(new TextEncoder().encode(description));
    await file.close();
}

export default useCreateDeck