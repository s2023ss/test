import styles from '../styles/test.module.css';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.title}>Supabase ile Next.js Projesi</h1>
    </div>
  );
}
