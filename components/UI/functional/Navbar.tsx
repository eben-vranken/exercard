'use client';

import React, { useCallback } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface NavProps {
    pageTitle: string;
}

const Navbar: React.FC<NavProps> = ({ pageTitle }) => {
    const AppWindow = React.useMemo(() => getCurrentWindow(), []);

    const minimizeWindow = useCallback(() => {
        AppWindow.minimize();
    }, [AppWindow]);

    const maximizeWindow = useCallback(() => {
        AppWindow.toggleMaximize();
    }, [AppWindow]);

    const closeWindow = useCallback(() => {
        AppWindow.close();
    }, [AppWindow]);

    const buttonStyles = "aspect-square w-3 rounded-full cursor-pointer hover:opacity-75";

    return (
        <nav className="h-11 flex items-center p-[10px] justify-between">
            {/* Page Title */}
            <section>
                <h1 className="font-bold text-main">
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
