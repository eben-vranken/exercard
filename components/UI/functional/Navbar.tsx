'use client';

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import React, { useCallback, useEffect, useState } from "react";
import CustomLink from "./Link";
import { Window } from "@tauri-apps/api/window";

interface NavProps {
    pageTitle?: string;
    back?: boolean;
}

const Navbar: React.FC<NavProps> = ({ pageTitle = '', back = false }) => {
    const [AppWindow, setAppWindow] = useState<Window>();

    useEffect(() => {
        import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
            setAppWindow(getCurrentWindow());
        });
    }, []);

    const minimizeWindow = useCallback(() => {
        AppWindow?.minimize();
    }, [AppWindow]);

    const maximizeWindow = useCallback(() => {
        AppWindow?.toggleMaximize();
    }, [AppWindow]);

    const closeWindow = useCallback(() => {
        AppWindow?.close();
    }, [AppWindow]);

    const buttonStyles = "aspect-square w-3 rounded-full cursor-pointer hover:opacity-75";

    return (
        <nav className="h-11 flex items-center p-[10px] justify-between relative" data-tauri-drag-region >
            {/* Page Title */}
            <section className="flex items-center justify-center gap-x-2">
                {back && (
                    <section className="z-10 text-light h-min">
                        <CustomLink back content={<ArrowLeft size={20} />} />
                    </section>
                )}
                <h1 className="font-bold text-main mt-20">
                    {pageTitle}
                </h1>
            </section>


            {/* Window Control */}
            <section className="flex items-center gap-x-2 z-10">
                <section
                    className={`${buttonStyles} bg-[#7FB069]`}
                    onClick={minimizeWindow}
                />
                <section
                    className={`${buttonStyles} bg-[#F4AC45]`}
                    onClick={maximizeWindow}
                />
                <section
                    className={`${buttonStyles} bg-[#D1462F]`}
                    onClick={closeWindow}
                />
            </section>
        </nav>
    );
};

export default Navbar;
