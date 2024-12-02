'use client'

import { Gear, Stack, UserCircle } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import CustomLink from "@/components/UI/functional/Link";

const Sidebar: React.FC = () => {
    const [userDecks, setUserDecks] = useState([]);

    useEffect(() => {
        setUserDecks([])
    }, [])

    return (
        <aside className="h-full flex lg:min-w-72 xl:min-w-96 border-r border-white border-opacity-5 flex-col relative overflow-hidden ">
            <section className="w-full h-11 flex justify-between items-center p-[10px]">

                {/* Sidebar Title */}
                <section className="flex items-center gap-x-2">
                    <Stack size={25} className="text-primary" />
                    <h1 className="font-bold">
                        Exercard
                    </h1>
                </section>

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
                    <CustomLink content={"New Deck"} href={"/create"} />
                    <CustomLink content={"Deck Library"} href={"/deck-library"} />
                </section>

                {/* Horizontal Divider */}
                <section className="opacity-5 border my-4" />

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
