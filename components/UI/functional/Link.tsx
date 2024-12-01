import Link from "next/link";

interface linkProps {
    content: React.ReactNode,
    href: string,
}

const CustomLink: React.FC<linkProps> = ({ content, href }) => {
    return (
        <Link href={href} className="hover:opacity-75">
            {content}
        </Link>
    )
}

export default CustomLink