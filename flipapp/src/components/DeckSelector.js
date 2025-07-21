import { useNavigate } from 'react-router-dom';

function DeckSelector() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select a Deck</h1>
      <button onClick={() => navigate('/practice/gk')}>General Knowledge</button>
      <br /><br />
      <button onClick={() => navigate('/practice/science')}>Science</button>
      <br /><br />
      <button onClick={() => navigate('/practice/sports')}>Sports</button>
    </div>
  );
}

export default DeckSelector;
