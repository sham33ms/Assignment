
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeckSelector from './components/DeckSelector';
import Practice from './pages/Practice';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeckSelector />} />
        <Route path="/practice/:deckId" element={<Practice />} />
      </Routes>
    </Router>
  );
}

export default App;
