import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OccasionCard from '../components/OccasionCard';
import './occasions.css';

const OccasionsPage = () => {
    const [occasions, setOccasions] = useState([]);

    useEffect(() => {
        // Fetch occasions data from an API or local source
        const fetchOccasions = async () => {
            // Example data fetching logic
            const response = await fetch('/api/occasions'); // Replace with actual API endpoint
            const data = await response.json();
            setOccasions(data);
        };

        fetchOccasions();
    }, []);

    return (
        <div className="occasions-page">
            <Header />
            <main>
                <h1>Occasions</h1>
                <div className="occasions-list">
                    {occasions.map((occasion) => (
                        <OccasionCard 
                            key={occasion.id} 
                            title={occasion.title} 
                            date={occasion.date} 
                            description={occasion.description} 
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OccasionsPage;