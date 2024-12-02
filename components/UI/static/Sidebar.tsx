'use client'

import { Gear, UserCircle } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import CustomLink from "@/components/UI/functional/Link";

const Sidebar: React.FC = () => {
    const [userDecks, setUserDecks] = useState([]);

    useEffect(() => {
        setUserDecks([])
    }, [])

    return (
        <aside className="h-full hidden md:flex md:min-w-52 lg:min-w-96 border-r border-white border-opacity-5 flex-col relative overflow-hidden ">
            {/* Sidebar Title */}
            <section className="w-full h-11 flex justify-between items-center p-[10px]">
                <h1 className="text-primary font-bold">Exercard</h1>

                {/* Icons */}
                <section className="flex items-center gap-x-2 text-light z-10">
                    <CustomLink href={"profile"} content={<UserCircle size={25} />} />

                    <CustomLink href={"settings"} content={<Gear size={25} />} />
                </section>
            </section>

            {/* Sidebar Links */}
            <section className="p-[10px]">
                <span className="text-xs text-ultralight">Navigation</span>
                <section className="flex flex-col gap-y-2 text-light">
                    <CustomLink content={"Home"} href={"/"} />
                    <CustomLink content={"Analytics"} href={"/analytics"} />
                    <CustomLink content={"Calendar View"} href={"/calendar"} />
                    <CustomLink content={"New deck"} href={"/create"} />
                    <CustomLink content={"Deck Library"} href={"/deck-library"} />
                </section>

                <section className="opacity-5 w-3/4 border-[1.5px] my-4" />

                {/* Decks */}
                <span className="text-xs text-ultralight">Decks</span>
                <section className="flex flex-col gap-y-2 text-light">
                    {userDecks.length > 0 ? "Decks present" : <span>No decks</span>}
                </section>
            </section>
        </aside>
    );
};

export default Sidebar;
