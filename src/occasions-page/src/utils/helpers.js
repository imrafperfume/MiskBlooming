export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const filterOccasionsByDate = (occasions, date) => {
    return occasions.filter(occasion => new Date(occasion.date).toDateString() === new Date(date).toDateString());
};

export const sortOccasionsByDate = (occasions) => {
    return occasions.sort((a, b) => new Date(a.date) - new Date(b.date));
};