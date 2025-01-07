'use client'

import { Gear, Stack, UserCircle, CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";
import CustomLink from "@/components/UI/functional/Link";
import DeckList from "../functional/deck/DeckList";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <aside
            className={`h-full border-r bg-background z-10 border-light flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "w-72 md:w-96" : "w-0"
                }`}
        >
            {/* Header */}
            <section className="w-full h-11 flex justify-between items-center p-2 z-10" data-tauri-drag-region>
                {/* Title */}
                <section
                    className={`flex items-center gap-x-2 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} duration-300`}
                >
                    <Stack size={25} className="text-primary" />
                    <h1 className="font-bold text-white">Exercard</h1>
                </section>
                {/* Icons */}
                <section className="flex items-center gap-x-2 text-light z-10">
                    <CustomLink href={"/profile"} content={<UserCircle size={25} />} />
                    <CustomLink href={"/settings"} content={<Gear size={25} />} />
                    {/* Toggle Button */}
                    <button
                        className="text-light flex items-center justify-center"
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <CaretDoubleLeft size={20} /> : <CaretDoubleRight size={20} />}
                    </button>
                </section>
            </section>

            {/* Sidebar Links */}
            <section
                className={`p-2 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} duration-300`}
            >
                <span className="text-xs text-ultralight">Navigation</span>
                <section className="flex flex-col gap-y-2 text-light">
                    <CustomLink content={"Home"} href={"/"} />
                    <CustomLink content={"Analytics"} href={"/analytics"} />
                    <CustomLink content={"Calendar View"} href={"/calendar"} />
                    <CustomLink content={"New Deck"} href={"/create-deck"} />
                    <CustomLink content={"Deck Library"} href={"/deck-library"} />
                </section>

                {/* Horizontal Divider */}
                <section className="border border-light my-4" />

                {/* Decks */}
                <span className="text-xs text-ultralight">Decks</span>
                <DeckList />
            </section>
            {/* Toggle Button */}
            <button
                className={`absolute top-2 left-2 p-2 text-light flex items-center justify-center transition-all duration-300 ${isOpen ? "opacity-0 hidden" : "opacity-100"
                    }`}
                onClick={toggleSidebar}
                style={{ zIndex: 20 }}
            >
                <CaretDoubleRight size={20} />
            </button>
        </aside>

    );
};

export default Sidebar;
