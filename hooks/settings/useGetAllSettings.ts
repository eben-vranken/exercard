import Database from "@tauri-apps/plugin-sql";

const useGetAllSettings = async () => {
    try {
        const db = await Database.load("sqlite:exercard.db");

        const result = await db.select<Setting[]>("SELECT * FROM settings");

        if (result.length > 0) {
            return { status: 'ok', settings: result };
        } else {
            return { status: 'error', message: `No settings found.` };
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to fetch settings: ${err.message}` };
        }
        return { status: 'error', message: 'An unknown error occurred when fetching specific deck' };
    }
}

export default useGetAllSettings;