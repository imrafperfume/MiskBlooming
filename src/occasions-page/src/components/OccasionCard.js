import React from 'react';
import PropTypes from 'prop-types';
import './occasions.css';

const OccasionCard = ({ title, date, description }) => {
    return (
        <div className="occasion-card">
            <h2 className="occasion-title">{title}</h2>
            <p className="occasion-date">{date}</p>
            <p className="occasion-description">{description}</p>
        </div>
    );
};

OccasionCard.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default OccasionCard;