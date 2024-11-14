import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import styles from '../styles/test.module.css';
import Navbar from '../components/Navbar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CategorySelector from '../components/CategorySelector';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Test() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [repeatQuestions, setRepeatQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

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

    const handleAnswerSelect = (questionId, answer) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const checkAnswers = () => {
        const correctAnswers = questions.map((question) => ({
            id: question.id,
            isCorrect: question.correct_answer === selectedAnswers[question.id],
            correctAnswer: question.correct_answer
        }));

        setResult(correctAnswers);
        setShowResults(true);

        const correct = correctAnswers.filter(item => item.isCorrect).length;
        const incorrect = correctAnswers.length - correct;

        setCorrectCount(correct);
        setIncorrectCount(incorrect);
    };

    const handleRepeatQuestion = (questionId) => {
        if (!repeatQuestions.includes(questionId)) {
            setRepeatQuestions((prev) => [...prev, questionId]);
            const currentRepeated = JSON.parse(localStorage.getItem('repeatedQuestions')) || [];
            localStorage.setItem('repeatedQuestions', JSON.stringify([...currentRepeated, questionId]));
        }
    };

    const filteredQuestions = selectedCategory
        ? questions.filter(question => question.category_id === parseInt(selectedCategory))
        : questions;

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const data = {
        labels: ['Doğru Cevap', 'Yanlış Cevap'],
        datasets: [
            {
                label: 'Cevap Sayısı',
                data: [correctCount, incorrectCount],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.6)',
                    'rgba(220, 53, 69, 0.6)',
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(220, 53, 69, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>Eklenen Sorular</h1>
            <CategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            {filteredQuestions.map((question) => (
                <div key={question.id} className={styles.question}>
                    <h2>Soru: {question.question}</h2>
                    <ul>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <li key={option}>
                                <button
                                    className={`${styles.button} ${selectedAnswers[question.id] === option ? styles.selected : ''}`}
                                    onClick={() => handleAnswerSelect(question.id, option)}
                                >
                                    {option}: {question[`option_${option.toLowerCase()}`]}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {showResults && result && (
                        <div>
                            <p style={{ color: result.find(item => item.id === question.id)?.isCorrect ? 'green' : 'red' }}>
                                {result.find(item => item.id === question.id)?.isCorrect ? 'Doğru Cevap!' : 'Yanlış Cevap!'}
                            </p>
                            {!result.find(item => item.id === question.id)?.isCorrect && (
                                <div>
                                    <p style={{ color: 'blue' }}>
                                        Doğru Cevap: {result.find(item => item.id === question.id)?.correctAnswer}
                                    </p>
                                    <button 
                                        className={styles.button} 
                                        onClick={() => handleRepeatQuestion(question.id)}
                                    >
                                        Tekrar Sor Bunu
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            <button className={styles.button} onClick={checkAnswers}>Cevapları Kontrol Et</button>

            {showResults && (
                <div className={styles.statistics}>
                    <h2>İstatistikler</h2>
                    <p>Doğru Cevap: {correctCount}</p>
                    <p>Yanlış Cevap: {incorrectCount}</p>
                    <Bar data={data} options={{ responsive: true }} />
                </div>
            )}
        </div>
    );
}
