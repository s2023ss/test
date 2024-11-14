import Link from 'next/link'; // Next.js Link bileşenini içe aktar
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/test.module.css'; // CSS modülünü içe aktar
import Navbar from '../components/Navbar'; // Navbar bileşenini içe aktar

export default function AddQuestion() {
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const { error } = await supabase
            .from('questions')
            .insert([{ 
                question, 
                option_a: optionA, 
                option_b: optionB, 
                option_c: optionC, 
                option_d: optionD, 
                correct_answer: correctAnswer 
            }]);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Soru başarıyla eklendi!');
            setQuestion('');
            setOptionA('');
            setOptionB('');
            setOptionC('');
            setOptionD('');
            setCorrectAnswer('');
        }
    };

    return (
        <div className={styles.container}>
            <Navbar /> {/* Navigasyon çubuğunu ekle */}
            <h1 className={styles.title}>Soru Ekle</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Soru:</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Seçenek A:</label>
                    <input
                        type="text"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Seçenek B:</label>
                    <input
                        type="text"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Seçenek C:</label>
                    <input
                        type="text"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Seçenek D:</label>
                    <input
                        type="text"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Doğru Cevap (A, B, C veya D):</label>
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Ekle</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}
