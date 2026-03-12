function QuoteCard({ quote, author, loading }) {
  if (loading) return <p>Loading quote...</p>;

  return (
    <div className="quote-box">
      <h3>"{quote}"</h3>
      <p>- {author}</p>
    </div>
  );
}

export default QuoteCard;