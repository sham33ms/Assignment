import { useRef, useState, useEffect } from 'react';

function FlipCard({ card, onAnswer }) {
  const cardRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  // Reset flip state when the card changes
  useEffect(() => {
    setFlipped(false);
    if (cardRef.current) {
      cardRef.current.classList.remove('flipped');
    }
  }, [card]);

  const flip = () => {
    setFlipped(true);
    cardRef.current.classList.add('flipped');
  };

  return (
    <div className="card-wrapper">
      <div className="card" ref={cardRef} onClick={flip}>
        <div className="front">{card.question}</div>
        <div className="back">
          {card.answer}
          <div className="answer-buttons">
            <button onClick={() => onAnswer(true)}>Correct</button>
            <button onClick={() => onAnswer(false)}>Wrong</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
