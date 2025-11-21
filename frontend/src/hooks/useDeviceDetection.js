import { useState, useEffect } from 'react';

/**
 * Hook para detectar el tipo de dispositivo basado en el ancho de pantalla
 * @returns {Object} - { deviceType, screenWidth, isMobile, isTablet, isDesktop }
 */
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  const getDeviceType = (width) => {
    let type;
    if (width < 768) {
      type = 'mobile';
    } else if (width >= 768 && width < 1024) {
      type = 'tablet';
    } else {
      type = 'desktop';
    }
    console.log('📱 Dispositivo detectado - Ancho:', width, 'Tipo:', type);
    return type;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setDeviceType(getDeviceType(width));
    };

    // Configurar el tipo inicial
    handleResize();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    deviceType,
    screenWidth,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet', 
    isDesktop: deviceType === 'desktop'
  };
};

/**
 * Hook para obtener configuración de pares por dispositivo
 * @returns {Object} - { pairsPerRow, maxCards, cardSize }
 */
export const useDevicePairConfig = () => {
  const { deviceType } = useDeviceDetection();

  const getConfigForDevice = () => {
    let config;
    switch (deviceType) {
      case 'mobile':
        config = {
          pairsPerRow: 4, // 4 cartas por fila
          totalPairs: 4, // 4 pares = 8 cartas totales
          cardSize: 'small',
          deviceType: 'mobile'
        };
        break;
      case 'tablet':
        config = {
          pairsPerRow: 4, // 4 cartas por fila
          totalPairs: 6, // 6 pares = 12 cartas totales
          cardSize: 'medium',
          deviceType: 'tablet'
        };
        break;
      case 'desktop':
      default:
        config = {
          pairsPerRow: 4, // 4 cartas por fila
          totalPairs: 8, // 8 pares = 16 cartas totales
          cardSize: 'large',
          deviceType: 'desktop'
        };
        break;
    }
    
    console.log('🔧 useDevicePairConfig - Dispositivo:', deviceType, 'Config:', config);
    return config;
  };

  return {
    deviceType,
    ...getConfigForDevice()
  };
};