'use client';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface LinkProps {
    content: React.ReactNode;
    href?: string;
    back?: boolean;
}

const CustomLink: React.FC<LinkProps> = ({ content, href = "", back = false }) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

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
