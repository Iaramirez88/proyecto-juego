import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import adminGameService from '../../services/adminGameService';
import PairGameConfig from './PairGameConfig';
import './AdminPanel.css';
const AdminPanel = () => {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // checking, connected, disconnected
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [showPairConfig, setShowPairConfig] = useState(false);


  // Cargar juegos desde la API real
  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar conexión primero
      const isConnected = await adminGameService.checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      // Cargar juegos
      const gamesList = await adminGameService.getAllGames();
      // Enriquecer con visibilidad local (ocultar/mostrar en dashboard)
      const visibilityConfig = JSON.parse(localStorage.getItem('adminGameVisibilityConfig') || '{}');
      const gamesWithVisibility = gamesList.map((game) => {
        const canonicalIds = ['pair-words', 'fall-module', 'vocabulary-game', 'audio-game', 'writing-game', 'armar'];
        let localId = adminGameService.mapApiGameIdToLocal(game.id);
        if (!canonicalIds.includes(localId)) {
          localId = adminGameService.mapApiGameIdToLocal(game.name);
        }
        const isVisible = visibilityConfig[localId] !== undefined ? visibilityConfig[localId] : (game.isVisible !== undefined ? game.isVisible : true);
        return { ...game, isVisible, _localId: localId };
      });
      setGames(gamesWithVisibility);
      
      // Cargar estadísticas
      const gameStats = await adminGameService.getGameStats();
      setStats(gameStats);
      
      console.log('✅ Juegos cargados:', gamesList);
    } catch (error) {
      console.error('❌ Error cargando juegos:', error);
      setError('Error al cargar juegos desde el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadGames();
    
    // 🎯 Escuchar cambios de configuración en tiempo real
    const handleConfigChange = (event) => {
      console.log('🔄 Configuración cambió, recargando juegos...', event.detail);
      loadGames(); // Recargar para reflejar cambios
    };
    
    // Agregar listener para cambios de configuración
    window.addEventListener('adminConfigChanged', handleConfigChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('adminConfigChanged', handleConfigChange);
    };
  }, []);

  // Toggle de juego con API real
  const toggleGame = async (gameId) => {
    try {
      setError(null);
      
      // 🎯 Actualizar UI inmediatamente para mejor UX
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === gameId 
            ? { ...game, isActive: !game.isActive }
            : game
        )
      );
      
      // Llamar a la API real o local
      const result = await adminGameService.toggleGame(gameId);
      
      if (result.success) {
        console.log(`✅ ${result.message}`, result.data.game);
        
        // Actualizar estadísticas
        const updatedStats = await adminGameService.getGameStats();
        setStats(updatedStats);
        
        // Confirmar el cambio (ya debería estar actualizado)
        setGames(prevGames => 
          prevGames.map(game => 
            game.id === gameId 
              ? { ...game, isActive: result.data.game.isActive }
              : game
          )
        );
        
      } else {
        // Si falla, revertir el cambio optimista
        setGames(prevGames => 
          prevGames.map(game => 
            game.id === gameId 
              ? { ...game, isActive: !game.isActive }
              : game
          )
        );
        throw new Error(result.message || 'Error al cambiar estado del juego');
      }
      
    } catch (error) {
      console.error('❌ Error en toggle:', error);
      setError(`Error al cambiar estado del juego: ${error.message}`);
      
      // Revertir cambio optimista en caso de error
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === gameId 
            ? { ...game, isActive: !game.isActive }
            : game
        )
      );
      
      // Recargar juegos para sincronizar
      setTimeout(loadGames, 1000);
    }
  };

  // 👁️ Toggle para ocultar/mostrar un juego en el dashboard
  const toggleGameVisibility = async (localGameId) => {
    try {
      setError(null);

      // Optimista
      setGames(prevGames =>
        prevGames.map(game =>
          (game._localId || game.id) === localGameId
            ? { ...game, isVisible: !game.isVisible }
            : game
        )
      );

      // Nota: esta feature es local (localStorage). Usamos el ID local canónico
      // para que el dashboard (que usa ids tipo 'pair-words', 'audio-game', etc.) lo respete.
      const result = await adminGameService.toggleGameVisibility(localGameId);

      if (!result.success) {
        // Revertir si falla
        setGames(prevGames =>
          prevGames.map(game =>
            (game._localId || game.id) === localGameId
              ? { ...game, isVisible: !game.isVisible }
              : game
          )
        );
        throw new Error(result.message || 'Error al cambiar visibilidad del juego');
      }

    } catch (error) {
      console.error('❌ Error en toggle visibilidad:', error);
      setError(`Error al cambiar visibilidad del juego: ${error.message}`);
      setTimeout(loadGames, 400);
    }
  };

  // 🔄 Función para resetear todo el progreso
  const resetAllProgress = () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás seguro de que quieres RESETEAR TODO el progreso?\n\n' +
      'Esto eliminará:\n' +
      '• Todo el progreso de juegos\n' +
      '• Todas las puntuaciones\n' +
      '• Todas las estrellas\n' +
      '• Configuración de usuario\n\n' +
      'Esta acción NO se puede deshacer.'
    );

    if (confirmed) {
      try {
        // Eliminar todos los datos locales
        localStorage.removeItem('koala_game_progress');
        localStorage.removeItem('koala_current_user');
        localStorage.removeItem('adminGameConfig');
        localStorage.removeItem('adminGameVisibilityConfig');
        
        // Mostrar mensaje de éxito
        alert('✅ Progreso reseteado completamente. La página se recargará.');
        
        // Recargar la página para aplicar cambios
        window.location.reload();
      } catch (error) {
        console.error('Error reseteando progreso:', error);
        alert('❌ Error al resetear el progreso. Inténtalo de nuevo.');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando juegos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="greeting">
          <div className="greeting-text">
            <h1>Panel de Administrador</h1>
          </div>
          <div className="greeting-subtext">
            <p>Gestiona la disponibilidad de juegos educativos</p>
          <button 
            className="admin-access-btn"
            onClick={() => history.push('/dashboard')}
            title="Panel de Administrador"
          >
            Volver a progreso
          </button>
          </div>
        </div>

        
        
        {/* Indicador de conexión */}
        {/* <div className={`connection-status ${connectionStatus}`}>
          <i className={`fas ${connectionStatus === 'connected' ? 'fa-wifi' : connectionStatus === 'disconnected' ? 'fa-wifi-slash' : 'fa-spinner fa-spin'}`}></i>
          <span>
            {connectionStatus === 'connected' && '🟢 Conectado al servidor'}
            {connectionStatus === 'disconnected' && '🔴 Modo offline - datos locales'}
            {connectionStatus === 'checking' && '🟡 Verificando conexión...'}
          </span>
        </div> */}
      </header>

      {/* Estadísticas generales */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Juegos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number active">{stats.active}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number inactive">{stats.inactive}</div>
          <div className="stat-label">Inactivos</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="games-grid">
        {games.map(game => {
          return (
          <div key={game.id} className={`game-card ${game.isActive ? 'active' : 'inactive'} ${game.isVisible ? '' : 'hidden-from-dashboard'}`}>
            <div className="game-header">
              <div className="game-info">
                <h3>{game.name}</h3>
                <span 
                  className="category-tag" 
                  style={{ backgroundColor: game.category.color + '20', color: game.category.color }}
                >
                  {game.category.name}
                </span>
              </div>
              <div className="game-status">
                <span className={`status-indicator ${game.isActive ? 'active' : 'inactive'}`}>
                  {game.isActive ? '✅ Activo' : '❌ Inactivo'}
                </span>
                <button
                  type="button"
                  className={`visibility-indicator ${game.isVisible ? 'visible' : 'is-hidden'}`}
                  onClick={() => toggleGameVisibility(game._localId || game.id)}
                  title={game.isVisible ? 'Click para ocultar del dashboard' : 'Click para mostrar en el dashboard'}
                >
                  {game.isVisible ? '👁️ Visible' : '🙈 Oculto'}
                </button>
              </div>
            </div>

            <p className="game-description">{game.description}</p>
            {!game.isVisible && (
              <p className="visibility-note">
                Este juego está oculto del dashboard.
              </p>
            )}

            <div className="game-meta">
              <span className="difficulty">
                📊 {game.difficulty === 'EASY' ? 'Fácil' : game.difficulty === 'MEDIUM' ? 'Medio' : 'Difícil'}
              </span>
            </div>

            <button 
              className={`toggle-button ${game.isActive ? 'deactivate' : 'activate'}`}
              onClick={() => toggleGame(game.id)}
            >
              {game.isActive ? '🔴 Desactivar' : '🟢 Activar'}
            </button>
            
            {/* Botón de configuración para juego de pares */}
            {game.id === '1' && (
              <button 
                className="config-button"
                onClick={() => setShowPairConfig(true)}
              >
                ⚙️ Configurar Pares
              </button>
            )}
          </div>
        )})}
      </div>

      <div className="admin-summary">
        <div className="summary-card">
          <h3>📊 Resumen</h3>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{games.filter(g => g.isActive).length}</span>
              <span className="stat-label">Juegos Activos</span>
            </div>
            <div className="stat">
              <span className="stat-number">{games.filter(g => !g.isActive).length}</span>
              <span className="stat-label">Juegos Inactivos</span>
            </div>
            <div className="stat">
              <span className="stat-number">{games.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          {/* Botón de reset */}
          <div className="admin-actions" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button 
              className="reset-button"
              onClick={resetAllProgress}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              🔄 RESETEAR TODO EL PROGRESO
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de configuración de pares */}
      {showPairConfig && (
        <div className="modal-overlay" onClick={() => setShowPairConfig(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <PairGameConfig onClose={() => setShowPairConfig(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;