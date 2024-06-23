import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardGrid = ({ games, onAddGame, onGameSelect, onEditGame }) => {
  const defaultImages = [
    '/img/d-img-01.webp',
    '/img/d-img-02.webp',
    '/img/d-img-03.webp',
    '/img/d-img-04.webp'
  ];

  const navigate = useNavigate();

  const getRandomImage = () => {
    const index = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[index];
  };

  const getImageSrc = (image) => {
    if (image && !image.startsWith('http')) {
      return `data:image/jpeg;base64,${image}`;
    } else if (!image) {
      return getRandomImage();
    }
    return image;
  };

  const handleClick = (e, game) => {
    e.stopPropagation();
    onEditGame(game);
  };

  function PlayGameButton({ class_code }) {
    const navigateToPlay = () => {
      navigate(`/play/${class_code}`);
    };
    return (
      <button className='card-play-game-btn' onClick={navigateToPlay}> 
        <i className="fal fa-play-circle"></i> Play Game
      </button>
    );
  }

  return (
    <section className='game-dash'>
      {games.map((game) => (
        <div className='game-card' key={game.game_id} onClick={() => onGameSelect(game)}>
          <img
            src={getImageSrc(game.image)}
            alt={`${game.title} game`}
          />
          <div className="game-card-content">
            <h5>{game.title}</h5>
            <p>{game.description}</p>
          </div>
          <div className="game-card-buttons">
            <button onClick={(e) => handleClick(e, game)}>Edit Game</button>
            <PlayGameButton class_code={game.class_code} />
          </div>
        </div>
      ))}
      <div className='game-card add-game' onClick={onAddGame}>
        <i className="fas fa-plus"></i>
        <h5>Create Game</h5>
      </div>
    </section>
  );
};

export default DashboardGrid;
