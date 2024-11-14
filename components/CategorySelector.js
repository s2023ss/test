import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './CategorySelector.css';

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*');

            if (error) {
                setError(error.message);
            } else {
                setCategories(data);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <label>Kategori Seçin:</label>
            <select className="category-select" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
                <option value="">Seçin</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelector;
