import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link'; // Next.js Link component
import styles from '../styles/test.module.css'; // Import CSS module
import Navbar from '../components/Navbar'; // Import Navbar component
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CategorySelector from '../components/CategorySelector'; // Import CategorySelector

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RepeatQuestions() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

    useEffect(() => {
        const fetchQuestions = async () => {
            // Get the repeated question IDs from local storage
            const repeatedQuestionIds = JSON.parse(localStorage.getItem('repeatedQuestions')) || [];

            if (repeatedQuestionIds.length > 0) {
                const { data, error } = await supabase
                    .from('questions')
                    .select('*')
                    .in('id', repeatedQuestionIds); // Fetch questions by IDs

                if (error) {
                    setError(error.message);
                } else {
                    setQuestions(data);
                }
            } else {
                setError('Tekrar sorulacak soru yok.');
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
            correctAnswer: question.correct_answer // Add correct answer
        }));

        setResult(correctAnswers);
        setShowResults(true); // Show results

        const correct = correctAnswers.filter(item => item.isCorrect).length;
        const incorrect = correctAnswers.length - correct;

        setCorrectCount(correct);
        setIncorrectCount(incorrect);

        // Remove correctly answered questions from local storage
        const repeatedQuestionIds = JSON.parse(localStorage.getItem('repeatedQuestions')) || [];
        const updatedRepeatedQuestions = repeatedQuestionIds.filter(id => !correctAnswers.find(item => item.id === id && item.isCorrect));
        localStorage.setItem('repeatedQuestions', JSON.stringify(updatedRepeatedQuestions));
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // Filter questions based on selected category
    const filteredQuestions = selectedCategory
        ? questions.filter(question => question.category_id === parseInt(selectedCategory))
        : questions;

    // Data for the bar chart
    const data = {
        labels: ['Doğru Cevap', 'Yanlış Cevap'],
        datasets: [
            {
                label: 'Cevap Sayısı',
                data: [correctCount, incorrectCount],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.6)', // Green for correct answers
                    'rgba(220, 53, 69, 0.6)', // Red for incorrect answers
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
            <Navbar /> {/* Add navigation bar */}
            <h1 className={styles.title}>Tekrar Sorulacak Sorular</h1>
            <CategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} /> {/* Category Selector */}
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
                                <p style={{ color: 'blue' }}>
                                    Doğru Cevap: {result.find(item => item.id === question.id)?.correctAnswer}
                                </p>
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
                    <Bar data={data} options={{ responsive: true }} /> {/* Render the bar chart */}
                </div>
            )}
            <Link href="/test">
                <button className={styles.button}>Test Sayfasına Dön</button>
            </Link>
        </div>
    );
}
