# 🎮 Sistema de Gamificación - PinguiPalabras

Sistema de animaciones y retroalimentación gamificada usando LottieFiles para mejorar la experiencia de usuario en los juegos educativos.

## 📦 Componentes Creados

### 1. `GamificationFeedback`
Componente principal que muestra animaciones de estrellas/caritas y mensajes motivacionales.

**Props:**
- `show` (boolean): Controla la visibilidad del feedback
- `performance` (number 0-100): Porcentaje de desempeño del jugador
- `onComplete` (function): Callback cuando la animación termina
- `customMessage` (string): Mensaje personalizado opcional

### 2. `StarAnimation`
Componente que muestra de 0 a 3 estrellas según el desempeño.

**Props:**
- `stars` (number 0-3): Cantidad de estrellas a mostrar
- `show` (boolean): Controla la visibilidad
- `onComplete` (function): Callback cuando termina la animación

### 3. `FaceAnimation`
Componente que muestra caritas animadas según el tipo de feedback.

**Props:**
- `type` (string): Tipo de carita ('excellent', 'happy', 'okay', 'sad', 'tryAgain')
- `show` (boolean): Controla la visibilidad

## 🎣 Hook: `useGamificationFeedback`

Hook personalizado que gestiona toda la lógica de gamificación.

### Funciones Disponibles:

#### `showSimpleFeedback(correct, total, message?)`
Muestra feedback basado en respuestas correctas/totales.

```javascript
const { showSimpleFeedback } = useGamificationFeedback();

// Ejemplo: 8 respuestas correctas de 10 intentos
showSimpleFeedback(8, 10);
```

#### `showAdvancedFeedback(correct, errors, timeSeconds, targetTime?, message?)`
Muestra feedback considerando tiempo y errores.

```javascript
const { showAdvancedFeedback } = useGamificationFeedback();

// Ejemplo: 8 correctas, 2 errores, en 45 segundos (objetivo: 60s)
showAdvancedFeedback(8, 2, 45, 60, '¡Rápido y preciso!');
```

#### `calculatePerformance(correct, total)`
Calcula el porcentaje de desempeño.

```javascript
const performance = calculatePerformance(8, 10); // 80%
```

#### `getStarCount(performance)`
Obtiene el número de estrellas según el desempeño.

```javascript
const stars = getStarCount(85); // Retorna 2
```

#### `getPerformanceLevel(performance)`
Obtiene el nivel textual del desempeño.

```javascript
const level = getPerformanceLevel(92); // Retorna 'excellent'
```

## 🚀 Instalación

```bash
cd frontend
npm install lottie-react --save
```

## 💻 Uso Básico

### Ejemplo 1: Feedback al Completar el Juego

```javascript
import React, { useState } from 'react';
import GamificationFeedback from '../components/games/GamificationFeedback';
import { useGamificationFeedback } from '../hooks/useGamificationFeedback';

const MiJuego = () => {
  const {
    showFeedback,
    performance,
    showSimpleFeedback,
    hideFeedback
  } = useGamificationFeedback();

  const handleGameComplete = () => {
    const correctAnswers = 8;
    const totalAttempts = 10;
    showSimpleFeedback(correctAnswers, totalAttempts);
  };

  return (
    <div>
      {/* Tu juego aquí */}
      <button onClick={handleGameComplete}>Completar</button>
      
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        onComplete={hideFeedback}
      />
    </div>
  );
};
```

### Ejemplo 2: Mostrar Estrellas por Cada Respuesta

```javascript
import React, { useState } from 'react';
import StarAnimation from '../components/games/StarAnimation';

const MiJuego = () => {
  const [showStars, setShowStars] = useState(false);
  const [stars, setStars] = useState(0);

  const handleCorrectAnswer = () => {
    setStars(3);
    setShowStars(true);
    setTimeout(() => setShowStars(false), 2000);
  };

  return (
    <div>
      <button onClick={handleCorrectAnswer}>Responder</button>
      
      <StarAnimation
        stars={stars}
        show={showStars}
      />
    </div>
  );
};
```

### Ejemplo 3: Feedback Avanzado con Tiempo

```javascript
import React, { useState } from 'react';
import GamificationFeedback from '../components/games/GamificationFeedback';
import { useGamificationFeedback } from '../hooks/useGamificationFeedback';

const MiJuego = () => {
  const [gameStartTime] = useState(Date.now());
  
  const {
    showFeedback,
    performance,
    showAdvancedFeedback,
    hideFeedback
  } = useGamificationFeedback();

  const handleGameComplete = (correct, errors) => {
    const timeElapsed = (Date.now() - gameStartTime) / 1000;
    const targetTime = 60; // 1 minuto objetivo
    
    showAdvancedFeedback(
      correct,
      errors,
      timeElapsed,
      targetTime,
      '¡Increíble velocidad!'
    );
  };

  return (
    <div>
      {/* Tu juego aquí */}
      <GamificationFeedback
        show={showFeedback}
        performance={performance}
        onComplete={hideFeedback}
      />
    </div>
  );
};
```

## 🎨 Niveles de Desempeño

El sistema clasifica automáticamente el desempeño en 4 niveles:

| Porcentaje | Nivel | Estrellas | Color de Fondo |
|------------|-------|-----------|----------------|
| 90% - 100% | Excellent | ⭐⭐⭐ | Degradado Rosa |
| 70% - 89% | Good | ⭐⭐ | Degradado Azul |
| 50% - 69% | Okay | ⭐ | Degradado Verde |
| 0% - 49% | Try Again | 😔 | Degradado Naranja |

## 📝 Mensajes Motivacionales

El sistema incluye mensajes motivacionales automáticos para cada nivel:

### Excellent (90%+)
- ¡Excelente trabajo! 🌟
- ¡Eres increíble! ⭐
- ¡Perfecto! ¡Sigue así! 🎉

### Good (70%-89%)
- ¡Muy bien! ¡Vas por buen camino! 👍
- ¡Buen trabajo! Sigue practicando 💪
- ¡Casi perfecto! ¡Sigue así! 🌟

### Okay (50%-69%)
- ¡Buen intento! Sigue practicando 💪
- ¡Vas mejorando! ¡No te rindas! 😊
- ¡Bien hecho! Puedes hacerlo mejor 🌟

### Try Again (<50%)
- ¡No te preocupes! ¡Inténtalo de nuevo! 💪
- ¡Todos cometemos errores! Sigue intentando 😊
- ¡Tú puedes! ¡Vamos a intentarlo otra vez! 🌈

## 🎯 Mensajes Personalizados

Puedes usar mensajes personalizados para cada juego:

```javascript
const customMessage = '¡Pingüi está orgulloso de ti! 🐧⭐';

showSimpleFeedback(correct, total, customMessage);
```

## 🎨 Personalización de Estilos

Los estilos están en:
- `frontend/src/assets/styles/gamification.css`
- `frontend/src/assets/styles/star-animation.css`

Puedes personalizar colores, tamaños y animaciones modificando estos archivos.

## 🌟 Animaciones de LottieFiles

### Usando Animaciones Personalizadas

Para usar tus propias animaciones de LottieFiles:

1. Ve a [LottieFiles.com](https://lottiefiles.com/)
2. Descarga la animación en formato JSON
3. Guárdala en `frontend/src/assets/animations/`
4. Importa y úsala:

```javascript
import starAnimation from '../../assets/animations/star.json';

<Lottie
  animationData={starAnimation}
  loop={true}
  autoplay={true}
  style={{ width: '300px', height: '300px' }}
/>
```

### Animaciones Recomendadas

Busca en LottieFiles:
- "stars celebration" - Para logros excelentes
- "happy face" - Para buen desempeño
- "sad face" - Para intentar de nuevo
- "trophy" - Para completar el juego
- "confetti" - Para celebraciones

## 📱 Responsive

El sistema es completamente responsive y se adapta a:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔧 Integración Completa

Para ver ejemplos completos de integración, revisa:
`frontend/src/components/games/GamificationIntegrationExample.js`

## 🐛 Solución de Problemas

### Las animaciones no se muestran
- Verifica que `lottie-react` esté instalado
- Asegúrate de importar los estilos CSS

### El feedback no desaparece
- Verifica que `onComplete` esté llamando a `hideFeedback()`

### Las estrellas no aparecen
- Verifica que el prop `show` esté en `true`
- Verifica que `stars` sea un número entre 0 y 3

## 📚 Referencias

- [LottieFiles](https://lottiefiles.com/)
- [lottie-react Documentation](https://www.npmjs.com/package/lottie-react)
- [Archivo de Ejemplos](./GamificationIntegrationExample.js)

## 🎓 Para PinguiPalabras

Para integrar en PinguiPalabras específicamente:

1. Importa el hook y componente
2. Llama a `showSimpleFeedback()` cuando complete una palabra
3. Usa `showStars` para feedback instantáneo en cada letra
4. Al finalizar el juego, usa `showAdvancedFeedback()` con tiempo

---

**Creado para ProEducativo-Koala** 🐨
*Sistema de gamificación educativa con animaciones LottieFiles*
