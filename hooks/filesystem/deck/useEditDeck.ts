import Database from "@tauri-apps/plugin-sql";

interface EditDeckProps {
    id: number;
    name: string;
    description: string;
}

const useEditDeck = async ({ id, name, description }: EditDeckProps): Promise<{ status: string; message: string }> => {
    try {
        const db = await Database.load("sqlite:decks.db");

        const updatedRows = await db.execute(
            "UPDATE decks SET name = $1, description = $2 WHERE id = $3",
            [name, description, id]
        );

        if (updatedRows.rowsAffected === 0) {
            return { status: "error", message: "No deck found with the given ID." };
        }

        return { status: "ok", message: "Deck updated successfully." };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: "error", message: `Failed to update deck: ${err.message}` };
        }
        return { status: "error", message: "An unknown error occurred when updating deck." };
    }
};

export default useEditDeck;
