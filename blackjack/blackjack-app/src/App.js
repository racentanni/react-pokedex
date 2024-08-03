// blackjack-app/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Fetch a new deck
        const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const deckData = await deckResponse.json();
        const deckId = deckData.deck_id;

        // Draw two cards
        const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
        const drawData = await drawResponse.json();
        const drawnCards = drawData.cards;

        // Ensure the two cards are different
        if (drawnCards.length === 2) {
          setCards(drawnCards);

          // Calculate the score
          const cardValues = drawnCards.map(card => card.value);
          const calculatedScore = cardValues.reduce((total, value) => {
            if (['KING', 'QUEEN', 'JACK'].includes(value)) {
              return total + 10;
            } else if (value === 'ACE') {
              return total + 11;
            } else {
              return total + parseInt(value);
            }
          }, 0);

          setScore(calculatedScore);

          // Check for Blackjack
          if (calculatedScore === 21) {
            setMessage('Blackjack!');
          }
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="App">
      <h1>Blackjack</h1>
      <div className="cards">
        {cards.map(card => (
          <img key={card.code} src={card.image} alt={card.value + ' of ' + card.suit} />
        ))}
      </div>
      <h2>Score: {score}</h2>
      {message && <h2>{message}</h2>}
    </div>
  );
};

export default App;
