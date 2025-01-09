'use client';

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface LinkProps {
    content: React.ReactNode;
    href?: string;
    back?: boolean;
    deck?: boolean;
    deckId?: string;
}

const CustomLink: React.FC<LinkProps> = ({ content, href = "", back = false, deck = false, deckId }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    let isActive = false;

    if (!deck) {
        isActive = href === "/" ? pathname === href : pathname.startsWith(href);
    } else {
        const currentDeckId = searchParams.get("deckId");
        console.log(currentDeckId, deckId);
        if (deckId && currentDeckId === deckId) {
            isActive = true;
        }
    }

    const handleClick = () => {
        if (back) {
            router.back();
        }
    };

    return (
        <section
            onClick={back ? handleClick : undefined}
            className={`w-fit hover:opacity-75 cursor-pointer ${isActive ? 'text-primary opacity-75' : ''}`}
        >
            {href && !back ? (
                <Link href={href}>
                    {content}
                </Link>
            ) : (
                content
            )}
        </section>
    );
};

export default CustomLink;
