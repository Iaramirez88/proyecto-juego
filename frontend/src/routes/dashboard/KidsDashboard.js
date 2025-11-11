import React, { useState, useEffect } from 'react';
import Header from '../../components/shared/Header';
import KoalaAvatar from '../../components/dashboard/KoalaAvatar';
import GameCard from '../../components/dashboard/GameCard';
import ProgressStars from '../../components/dashboard/ProgressStars';
import StatsBallon from '../../components/dashboard/StatsBallon';
import '../../assets/styles/kids-dashboard.css';

const KidsDashboard = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data para el dashboard - después se conectará con la API real
    const mockData = {
      user: {
        name: "Sofia",
        avatar: "happy", // happy, excited, super
        totalStars: 23,
        level: 3,
        gamesCompleted: 5,
        timePlayedToday: 45 // minutos
      },
      games: [
        {
          id: 1,
          name: "Arma Pares",
          icon: "🎯",
          color: "#FF6B6B",
          stars: 4,
          maxStars: 5,
          completed: true,
          lastScore: 850
        },
        {
          id: 2,
          name: "Vocabulario",
          icon: "📝",
          color: "#4ECDC4",
          stars: 3,
          maxStars: 5,
          completed: true,
          lastScore: 720
        },
        {
          id: 3,
          name: "Escucha",
          icon: "👂",
          color: "#45B7D1",
          stars: 5,
          maxStars: 5,
          completed: true,
          lastScore: 950
        },
        {
          id: 4,
          name: "Escritura",
          icon: "✏️",
          color: "#96CEB4",
          stars: 2,
          maxStars: 5,
          completed: false,
          lastScore: 450
        },
        {
          id: 5,
          name: "Otoño",
          icon: "🍂",
          color: "#FECA57",
          stars: 0,
          maxStars: 5,
          completed: false,
          lastScore: 0
        }
      ],
      achievements: [
        { id: 1, name: "Primera Estrella", icon: "⭐", earned: true },
        { id: 2, name: "Súper Jugador", icon: "🏆", earned: true },
        { id: 3, name: "Koala Feliz", icon: "🐨", earned: false }
      ]
    };

    // Simular carga de datos
    setTimeout(() => {
      setUserProgress(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="kids-dashboard loading">
        <div className="loading-koala">
          <div className="koala-spinner">🐨</div>
          <p>¡El Koala está preparando tu progreso!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kids-dashboard">
      <Header />
      
      {/* Sección principal con avatar y saludo */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <KoalaAvatar level={userProgress.user.level} mood={userProgress.user.avatar} />
          <div className="hero-text">
            <h1 className="welcome-title">¡Hola {userProgress.user.name}! 🌟</h1>
            <p className="welcome-subtitle">¡Tu Koala está muy orgulloso de ti!</p>
            <ProgressStars 
              current={userProgress.user.totalStars} 
              total={50} 
              level={userProgress.user.level}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas con globos */}
      <div className="stats-balloons">
        <StatsBallon 
          icon="⭐" 
          value={userProgress.user.totalStars} 
          label="Estrellitas" 
          color="#FFD93D"
        />
        <StatsBallon 
          icon="🎮" 
          value={userProgress.user.gamesCompleted} 
          label="Juegos Completados" 
          color="#6BCF7F"
        />
        <StatsBallon 
          icon="⏰" 
          value={`${userProgress.user.timePlayedToday} min`} 
          label="Tiempo Hoy" 
          color="#4D96FF"
        />
      </div>

      {/* Grid de juegos */}
      <div className="games-section">
        <h2 className="section-title">🎯 Tus Juegos Favoritos</h2>
        <div className="games-grid">
          {userProgress.games.map(game => (
            <GameCard 
              key={game.id}
              game={game}
              onClick={() => console.log(`Navegando a juego: ${game.name}`)}
            />
          ))}
        </div>
      </div>

      {/* Sección de logros */}
      <div className="achievements-section">
        <h2 className="section-title">🏆 Tus Súper Logros</h2>
        <div className="achievements-grid">
          {userProgress.achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`achievement-badge ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="motivation-section">
        <div className="motivation-card">
          <div className="motivation-koala">🐨💝</div>
          <p className="motivation-text">
            "¡Sigue así! Cada estrella que consigues hace que tu Koala esté más feliz."
          </p>
        </div>
      </div>
    </div>
  );
};

export default KidsDashboard;