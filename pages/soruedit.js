import Link from 'next/link'; // Next.js Link component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import styles from '../styles/test.module.css'; // Import CSS module
import Navbar from '../components/Navbar'; // Import Navbar component

export default function EditQuestion() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*');

            if (error) {
                setError(error.message);
            } else {
                setQuestions(data);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, []);

    const handleEdit = (id) => {
        router.push(`/edit-question?id=${id}`); // Redirect to edit question page
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className={styles.container}>
            <Navbar /> {/* Add navigation bar */}
            <h1 className={styles.title}>Soruların Listesi</h1>
            {questions.length === 0 ? (
                <p>Hiç soru bulunamadı.</p>
            ) : (
                questions.map((question) => (
                    <div key={question.id} className={styles.question}>
                        <h2>Soru: {question.question}</h2>
                        <div>
                            <strong>Cevaplar:</strong>
                            <ul>
                                <li>A: {question.option_a}</li>
                                <li>B: {question.option_b}</li>
                                <li>C: {question.option_c}</li>
                                <li>D: {question.option_d}</li>
                            </ul>
                        </div>
                        <button className={styles.button} onClick={() => handleEdit(question.id)}>
                            Düzenle
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
