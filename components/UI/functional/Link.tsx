import Link from "next/link";
import { usePathname } from "next/navigation";

interface linkProps {
    content: React.ReactNode,
    href: string,
}

const CustomLink: React.FC<linkProps> = ({ content, href }) => {
    const pathname = usePathname()

    return (
        <Link href={href} className={`hover:opacity-75 ${pathname === href ? 'text-primary opacity-75' : ''}`}>
            {content}
        </Link>
    )
}

export default CustomLink