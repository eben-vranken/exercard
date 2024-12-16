'use client';

import EditDeckForm from "@/components/UI/functional/deck/EditDeck";
import Navbar from "@/components/UI/functional/Navbar";
import { Suspense } from "react";

const EditDeck: React.FC = () => {
    return (
        <main className="w-full flex flex-col">
            <Navbar />

            <Suspense>
                <EditDeckForm />
            </Suspense>
        </main >
    )
}

export default EditDeck;