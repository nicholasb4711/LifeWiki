import Link from 'next/link';
import Image from 'next/image';
import styles from './NavMenu.module.css';

export default function NavMenu() {
    return (
        <nav className={styles.navMenu}>
            <Link href={'/'}>
                <Image src="next.svg" alt="Life Wiki Logo" width={100} height={100} />
            </Link>
            <ul className={styles.links}>
                <li>
                    <Link href={'/'}>Home</Link>
                </li>
                <li>
                    <Link href={'/pages/about'}>About</Link>
                </li>
            </ul>
        </nav>
    )

}