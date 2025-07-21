// src/pages/Practice.js
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import decks from '../data/decks';
import FlipCard from '../components/FlipCard';
import ScoreScreen from '../components/ScoreScreen';

function Practice() {
  const { deckId } = useParams(); // Get the deck ID from the URL
  const [cards, setCards] = useState([]); // Store the cards for the current deck
  const [current, setCurrent] = useState(0); // Index of the current card
  const [correct, setCorrect] = useState(0); // Total correct answers
  const [showScore, setShowScore] = useState(false); // Show score screen or not

  useEffect(() => {
    const selectedDeck = decks[deckId];
    if (selectedDeck) {
      const shuffled = [...selectedDeck].sort(() => 0.5 - Math.random()); // Shuffle the cards
      setCards(shuffled);
    }
  }, [deckId]);

  const handleAnswer = (userClickedCorrect) => {
    const actualCorrect = cards[current].isCorrect; // Check if the card is actually correct
    if (userClickedCorrect === actualCorrect) {
      setCorrect(correct + 1); // Add 1 only if user answered correctly
    }

    const next = current + 1;
    if (next >= cards.length) {
      setShowScore(true);
    } else {
      setCurrent(next);
    }
  };

  const currentCard = cards[current];

  return (
    <div className="container">
      {!showScore ? (
        <>
          <div className="progress">Progress: {current + 1}/{cards.length}</div>
          {currentCard ? (
            <FlipCard card={currentCard} onAnswer={handleAnswer} />
          ) : (
            <p>Loading card...</p>
          )}
        </>
      ) : (
        <ScoreScreen score={correct} total={cards.length} />
      )}
    </div>
  );
}

export default Practice;
