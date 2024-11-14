import Link from 'next/link';
import styles from '../styles/navbar.module.css'; // Import CSS module for navbar styles

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li>
                    <Link href="/test">Test</Link>
                </li>
                <li>
                    <Link href="/tekrarlanacakSorular">Tekrar Sorulacak Sorular</Link>
                </li>
                {/* Add more links as needed */}
                <li>
                    <Link href="/soruedit">Soru Düzenle</Link>
                </li>
                <li>
                    <Link href="/categories">Kategoriler</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
