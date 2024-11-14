import Link from 'next/link'; // Next.js Link bileşenini içe aktar
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import styles from '../styles/test.module.css'; // CSS modülünü içe aktar
import Navbar from '../components/Navbar'; // Navbar bileşenini içe aktar
import CategorySelector from '../components/CategorySelector';

export default function EditQuestion() {
    const router = useRouter();
    const { id } = router.query; // URL'den soru ID'sini al
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('questions')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setError(error.message);
                } else {
                    setQuestion(data.question);
                    setOptionA(data.option_a);
                    setOptionB(data.option_b);
                    setOptionC(data.option_c);
                    setOptionD(data.option_d);
                    setCorrectAnswer(data.correct_answer);
                    setCategoryId(data.category_id);
                }
            }
        };

        fetchQuestion();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const { error } = await supabase
            .from('questions')
            .update({
                question,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                correct_answer: correctAnswer,
                category_id: categoryId,
            })
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Soru başarıyla güncellendi!');
            // İsterseniz güncelleme sonrası başka bir sayfaya yönlendirebilirsiniz
            // router.push('/test'); // Örneğin test sayfasına yönlendirme
        }
    };

    return (
        <div className={styles.container}>
            <Navbar /> {/* Navigasyon çubuğunu ekle */}
            <h1 className={styles.title}>Soru Düzenle</h1>
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
                    <label>Doğru Cevap:</label>
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    />
                </div>
                <CategorySelector selectedCategory={categoryId} onCategoryChange={setCategoryId} />
                <button type="submit" className={styles.button}>Güncelle</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}
