import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSetBackGround } from '../../hooks/useSetBackGround';
import localProgressService from '../../services/localProgressService';
import GameCard from '../../components/dashboard/GameCard';
import '../../assets/styles/kids-dashboard.css';

// Importar iconos del home para consistencia visual
import {
  iconoVocabulario,
  iconoEscucha, 
  iconopares,
  iconoOtono,
  iconoEscritura
} from '../../utils/imagesResources';

const KidsDashboard = () => {
  const history = useHistory();
  
  // Establecer fondo amarillo
  useSetBackGround(null, '#FFE082');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos mock como fallback
  const mockData = {
    userInfo: {
      name: 'Estudiante',
      totalStars: 8,
      achievementBadges: ['primera-estrella']
    },
    overallProgress: {
      totalGamesPlayed: 3,
      totalGamesAvailable: 6,
      averageScore: 82
    },
    games: [
      {
        id: 'vocabulary-game',
        name: 'Vocabulario',
        icon: iconoVocabulario,
        color: '#66BB6A',
        stars: 2,
        maxStars: 3,
        lastScore: 200,
        isAvailable: true,
        route: '/vocabulario/A'
      },
      {
        id: 'audio-game',
        name: 'Escucha',
        icon: iconoEscucha,
        color: '#42A5F5',
        stars: 1,
        maxStars: 3,
        lastScore: 150,
        isAvailable: true,
        route: '/escucha/A'
      },
      {
        id: 'pair-words',
        name: 'Pares',
        icon: iconopares,
        color: '#FF6B9D',
        stars: 3,
        maxStars: 3,
        lastScore: 380,
        isAvailable: true,
        route: '/pares/A'
      },
      {
        id: 'fall-module',
        name: 'Otoño',
        icon: iconoOtono,
        color: '#FFA726',
        stars: 2,
        maxStars: 3,
        lastScore: 250,
        isAvailable: true,
        route: '/otoño/A'
      },
      {
        id: 'writing-game',
        name: 'Escritura',
        icon: iconoEscritura,
        color: '#9C27B0',
        stars: 1,
        maxStars: 3,
        lastScore: 120,
        isAvailable: true,
        route: '/escritura/A'
      }
    ]
  };

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Usar la versión asíncrona que verifica disponibilidad de juegos
      const data = await localProgressService.getDashboardSummaryAsync();
      
      console.log('📊 Dashboard cargado con verificación de juegos activos:', data);
      console.log('🎮 Juegos recibidos en dashboard:', data?.games);
      console.log('⭐ Total de estrellas en userInfo:', data?.userInfo?.totalStars);
      
      setDashboardData(data);
      setError(null);
    } catch (error) {
      console.warn('Error cargando datos con verificación:', error);
      
      // Fallback a versión síncrona
      try {
        const fallbackData = localProgressService.getDashboardSummary();
        setDashboardData(fallbackData);
        setError('Usando datos locales sin verificación de activación');
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        setDashboardData(mockData);
        setError('Usando datos mock');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Variables para tracking de cambios
    let lastKnownConfig = localStorage.getItem('adminGameConfig');
    let isCheckingChanges = false;
    
    // Función mejorada para verificar cambios
    const checkForConfigChanges = () => {
      if (isCheckingChanges) return; // Evitar múltiples checks simultáneos
      
      const currentConfig = localStorage.getItem('adminGameConfig');
      
      if (currentConfig !== lastKnownConfig) {
        console.log('🔄 CAMBIO DETECTADO en adminGameConfig:');
        console.log('   Anterior:', lastKnownConfig);
        console.log('   Actual:', currentConfig);
        
        lastKnownConfig = currentConfig;
        isCheckingChanges = true;
        
        // Recargar dashboard con delay para asegurar que el cambio se procese
        setTimeout(() => {
          loadDashboardData().finally(() => {
            isCheckingChanges = false;
          });
        }, 200);
      }
    };

    // 1. Event listener para cambios desde otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'adminGameConfig') {
        console.log('🔄 Cambio desde OTRA PESTAÑA detectado');
        checkForConfigChanges();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 2. Polling frecuente para cambios en la misma pestaña
    const configCheckInterval = setInterval(checkForConfigChanges, 500); // Cada 500ms

    // 3. Check al hacer focus en la ventana
    const handleWindowFocus = () => {
      console.log('🔄 Ventana enfocada - verificando cambios...');
      setTimeout(checkForConfigChanges, 100);
    };
    window.addEventListener('focus', handleWindowFocus);

    // 4. Check al hacer click en la ventana
    const handleWindowClick = () => {
      checkForConfigChanges();
    };
    window.addEventListener('click', handleWindowClick);

    // 5. Escuchar evento personalizado de cambio de config
    const handleAdminConfigChange = (e) => {
      console.log('🎯 Evento adminConfigChanged recibido:', e.detail);
      setTimeout(checkForConfigChanges, 100);
    };
    window.addEventListener('adminConfigChanged', handleAdminConfigChange);

    // 6. Escuchar evento de forzar recarga
    const handleForceReload = (e) => {
      console.log('⚡ Evento forceConfigReload recibido:', e.detail);
      setTimeout(checkForConfigChanges, 50);
    };
    window.addEventListener('forceConfigReload', handleForceReload);
    
    // 7. Escuchar evento de actualización de progreso
    const handleProgressUpdate = (e) => {
      console.log('📊 Evento progressUpdated recibido:', e.detail);
      console.log('🔄 Recargando dashboard por actualización de progreso...');
      setTimeout(() => {
        loadDashboardData();
      }, 300);
    };
    window.addEventListener('progressUpdated', handleProgressUpdate);

    // 6. Observador de mutaciones en localStorage (experimental)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      const result = originalSetItem.apply(this, arguments);
      if (key === 'adminGameConfig') {
        console.log('🔄 localStorage.setItem interceptado para adminGameConfig');
        setTimeout(checkForConfigChanges, 100);
      }
      return result;
    };
    
    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('adminConfigChanged', handleAdminConfigChange);
      window.removeEventListener('forceConfigReload', handleForceReload);
      window.removeEventListener('progressUpdated', handleProgressUpdate);
      clearInterval(configCheckInterval);
      
      // Restaurar localStorage original
      localStorage.setItem = originalSetItem;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGameClick = (game) => {
    if (!game.isAvailable) {
      alert('Juego no disponible 🔒');
      return;
    }
    history.push(game.route);
  };

  if (loading) {
    return (
      <div className="kids-dashboard loading">
        <div className="loading-content">
          <div className="koala-avatar">🐨</div>
          <h2>Cargando tu progreso...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="kids-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="greeting">
          <div className="greeting-text">
            <h1>¡Hola, {dashboardData?.userInfo.name || 'Estudiante'}! 👋</h1>
          </div>
          <div className="greeting-subtext">
            <p>¡Sigue jugando y aprendiendo!</p>
          </div>
          {/* Botón para Admin (discreto) */}
          <button 
            className="admin-access-btn"
            onClick={() => history.push('/admin')}
            title="Panel de Administrador"
          >
            ⚙️Panel de Administrador
          </button>
        </div>

        

      {/* Juegos */}
      <div className="games-section">
        <div className='section-progress-resume'>
          <div className='box-section-title'>
            <h2 className="section-title">Tu Progreso</h2>
          </div>
          {/* Progreso */}
          <div className="progress-summary">
            <div className="progress-card">
              <span className="progress-icon">⭐</span>
              <div className="progress-info">
                <div className="progress-number">{dashboardData?.userInfo.totalStars || 0}</div>
                <div className="progress-label">Estrellas</div>
              </div>
            </div>
            <div className="progress-card">
              <span className="progress-icon">🎮</span>
              <div className="progress-info">
                <div className="progress-number">{dashboardData?.overallProgress.totalGamesPlayed || 0}</div>
                <div className="progress-label">Juegos</div>
              </div>
            </div>
            <div className="progress-card">
              <span className="progress-icon">🎯</span>
              <div className="progress-info">
                <div className="progress-number">{dashboardData?.overallProgress.averageScore || 0}%</div>
                <div className="progress-label">Promedio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={loadDashboardData}>🔄 Reintentar</button>
          </div>
        )}
        </div>
        
        
        <div className="games-grid">
          {dashboardData?.games?.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      </div>

      {/* Logros */}
      {/* <div className="achievements-section">
        <h2 className="section-title">🏆 Logros</h2>
        <div className="achievements-grid">
          {dashboardData?.userInfo.achievementBadges?.map((badge, index) => (
            <div key={index} className="achievement-badge">
              <span className="badge-icon">⭐</span>
              <span className="badge-name">
                {badge === 'primera-estrella' && 'Primera Estrella'}
                {badge === 'cinco-juegos' && 'Cinco Juegos'}
                {badge === 'velocista' && 'Súper Rápido'}
              </span>
            </div>
          )) || (
            <div className="no-achievements">
              <p>🎯 ¡Juega más para ganar logros!</p>
            </div>
          )}
        </div>
      </div> */}

      {/* Footer */}
      <div className="dashboard-footer">
        <button onClick={loadDashboardData} disabled={loading}>
          {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
        </button>
        
        {/* Botón discreto para forzar actualización */}
        <button 
          onClick={() => {
            console.log('🔧 FORZAR ACTUALIZACIÓN MANUAL');
            console.log('📋 Config actual:', localStorage.getItem('adminGameConfig'));
            loadDashboardData();
            
            // También disparar el servicio de forzado
            localProgressService.forceConfigReload();
          }}
          style={{
            marginLeft: '10px',
            background: '#607D8B',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '12px',
            opacity: '0.7',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          title="Forzar actualización de estados de juegos"
        >
          ⚡ Sync
        </button>
        
        <div className="last-update">
          🕐 {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default KidsDashboard;