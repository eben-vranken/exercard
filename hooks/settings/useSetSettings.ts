import Database from "@tauri-apps/plugin-sql";

const useSetSettings = async (settings: { [key: string]: string | number }) => {
    try {
        const db = await Database.load("sqlite:exercard.db");

        const updatePromises = Object.entries(settings).map(async ([key, value]) => {
            console.log('Applying setting:', key, value);
            await db.execute(
                "UPDATE settings SET value = ? WHERE key = ?",
                [value, key]
            );
        });

        await Promise.all(updatePromises);

        return { status: 'ok' };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 'error', message: `Failed to update settings: ${err.message}` };
        }
        return { status: 'error', message: 'An unknown error occurred when updating settings' };
    }
};

export default useSetSettings;
