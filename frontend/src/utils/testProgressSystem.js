/**
 * Utilidad para probar el sistema de progreso local
 * Ejecutar en la consola del navegador para testing
 */

import localProgressService from '../services/localProgressService';

export const testProgressSystem = () => {
  console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA DE PROGRESO LOCAL');
  console.log('='.repeat(50));

  // 1. Limpiar todo para empezar desde cero
  console.log('\n1️⃣ Limpiando datos previos...');
  localProgressService.clearAllProgress();
  console.log('✅ Datos limpiados');

  // 2. Verificar usuario por defecto
  console.log('\n2️⃣ Verificando usuario por defecto...');
  const user = localProgressService.getCurrentUser();
  console.log('👤 Usuario:', user);

  // 3. Simular progreso en el juego de pares
  console.log('\n3️⃣ Simulando progreso en Pares...');
  
  // Primer par encontrado
  const pairResult1 = localProgressService.saveGameProgress({
    gameId: 'pair-words',
    score: 100,
    timeSpent: 15,
    level: 'A',
    additionalData: {
      pairsFound: 1,
      totalPairs: 4,
      level: 'A'
    }
  });
  console.log('🧩 Primer par:', pairResult1);

  // Segundo par encontrado
  const pairResult2 = localProgressService.saveGameProgress({
    gameId: 'pair-words',
    score: 200,
    timeSpent: 30,
    level: 'A',
    additionalData: {
      pairsFound: 2,
      totalPairs: 4,
      level: 'A'
    }
  });
  console.log('🧩 Segundo par:', pairResult2);

  // Juego completado
  const pairCompleted = localProgressService.saveGameProgress({
    gameId: 'pair-words',
    score: 400,
    timeSpent: 60,
    level: 'A',
    additionalData: {
      pairsFound: 4,
      totalPairs: 4,
      level: 'A',
      completed: true
    }
  });
  console.log('🎉 Pares completado:', pairCompleted);

  // 4. Simular progreso en juegos adicionales
  console.log('\n4️⃣ Simulando progreso en Vocabulario...');
  const vocabResult = localProgressService.saveGameProgress({
    gameId: 'vocabulary-game',
    score: 300,
    timeSpent: 120,
    level: 'A',
    additionalData: {
      wordsCompleted: 3,
      totalWords: 3,
      level: 'A',
      completed: true,
      gameType: 'vocabulary'
    }
  });
  console.log('📚 Vocabulario completado:', vocabResult);

  console.log('\n5️⃣ Simulando progreso en Audio...');
  const audioResult = localProgressService.saveGameProgress({
    gameId: 'audio-game',
    score: 225,
    timeSpent: 90,
    level: 'A',
    additionalData: {
      groupsCompleted: 3,
      totalGroups: 3,
      level: 'A',
      completed: true,
      gameType: 'audio-recognition'
    }
  });
  console.log('🔊 Audio completado:', audioResult);

  console.log('\n6️⃣ Simulando progreso en Escritura...');
  const writingResult = localProgressService.saveGameProgress({
    gameId: 'writing-game',
    score: 240,
    timeSpent: 110,
    level: 'A',
    additionalData: {
      wordsCompleted: 3,
      totalWords: 3,
      level: 'A',
      completed: true,
      gameType: 'writing'
    }
  });
  console.log('✏️ Escritura completado:', writingResult);

  // 5. Simular progreso en el juego de otoño
  console.log('\n7️⃣ Simulando progreso en Otoño...');
  
  const fallResult = localProgressService.saveGameProgress({
    gameId: 'fall-module',
    score: 275,
    timeSpent: 45,
    level: 'B',
    additionalData: {
      currentQuestion: 5,
      totalQuestions: 5,
      correctAnswers: 5,
      level: 'B',
      completed: true
    }
  });
  console.log('🍂 Otoño completado:', fallResult);

  // 6. Obtener resumen del dashboard
  console.log('\n8️⃣ Obteniendo resumen del dashboard...');
  const dashboard = localProgressService.getDashboardSummary();
  console.log('📊 Dashboard:', dashboard);

  // 7. Verificar progreso individual
  console.log('\n9️⃣ Verificando progreso individual de todos los juegos...');
  const pairProgress = localProgressService.getGameProgress('pair-words', 'A');
  const fallProgress = localProgressService.getGameProgress('fall-module', 'B');
  const vocabProgress = localProgressService.getGameProgress('vocabulary-game', 'A');
  const audioProgress = localProgressService.getGameProgress('audio-game', 'A');
  const writingProgress = localProgressService.getGameProgress('writing-game', 'A');
  
  console.log('🧩 Progreso Pares nivel A:', pairProgress);
  console.log('🍂 Progreso Otoño nivel B:', fallProgress);
  console.log('📚 Progreso Vocabulario nivel A:', vocabProgress);
  console.log('🔊 Progreso Audio nivel A:', audioProgress);
  console.log('✏️ Progreso Escritura nivel A:', writingProgress);

  // 8. Exportar datos para backup
  console.log('\n🔟 Exportando datos...');
  const exportData = localProgressService.exportProgress();
  console.log('💾 Datos exportados:', exportData);

  console.log('\n🎉 PRUEBAS COMPLETADAS EXITOSAMENTE');
  console.log('='.repeat(50));

  return {
    user,
    dashboard,
    gameProgress: {
      pairProgress,
      fallProgress,
      vocabProgress,
      audioProgress,
      writingProgress
    },
    exportData
  };
};

// Función para probar reset del sistema
export const resetTestData = () => {
  console.log('🔄 Reseteando sistema de prueba...');
  localProgressService.clearAllProgress();
  console.log('✅ Sistema limpio y listo');
};

// Función para agregar datos de muestra
export const addSampleData = () => {
  console.log('🎯 Agregando datos de muestra para los 5 juegos...');
  
  const sampleGames = [
    // Juego de Pares
    {
      gameId: 'pair-words',
      score: 380,
      timeSpent: 120,
      level: 'A',
      additionalData: { completed: true, pairsFound: 4, totalPairs: 4 }
    },
    {
      gameId: 'pair-words', 
      score: 350,
      timeSpent: 95,
      level: 'B',
      additionalData: { completed: true, pairsFound: 4, totalPairs: 4 }
    },
    // Juego de Otoño
    {
      gameId: 'fall-module',
      score: 275,
      timeSpent: 80,
      level: 'A',
      additionalData: { completed: true, correctAnswers: 5, totalQuestions: 5 }
    },
    // Juego de Vocabulario
    {
      gameId: 'vocabulary-game',
      score: 300,
      timeSpent: 150,
      level: 'A',
      additionalData: { completed: true, wordsCompleted: 3, totalWords: 3, gameType: 'vocabulary' }
    },
    // Juego de Audio
    {
      gameId: 'audio-game',
      score: 225,
      timeSpent: 90,
      level: 'A',
      additionalData: { completed: true, groupsCompleted: 3, totalGroups: 3, gameType: 'audio-recognition' }
    },
    // Juego de Escritura
    {
      gameId: 'writing-game',
      score: 240,
      timeSpent: 110,
      level: 'A',
      additionalData: { completed: true, wordsCompleted: 3, totalWords: 3, gameType: 'writing' }
    }
  ];

  sampleGames.forEach(game => {
    localProgressService.saveGameProgress(game);
  });

  console.log('✅ Datos de muestra agregados para todos los juegos');
  return localProgressService.getDashboardSummary();
};