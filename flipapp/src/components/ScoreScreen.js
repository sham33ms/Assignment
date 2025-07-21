import { useNavigate } from "react-router-dom";

function ScoreScreen({ score, total }) {
    const navigate = useNavigate();
  return (

    <div className="score-screen">
      <h2>Session Complete!</h2>
      <p>Your Score: {score} / {total}</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}

export default ScoreScreen;
