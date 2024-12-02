import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkProps {
    content: React.ReactNode;
    href: string;
}

const CustomLink: React.FC<LinkProps> = ({ content, href }) => {
    const pathname = usePathname();

    const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`hover:opacity-75 ${isActive ? 'text-primary opacity-75' : ''}`}
        >
            {content}
        </Link>
    );
};

export default CustomLink;
