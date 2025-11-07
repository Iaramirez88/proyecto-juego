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
    if (width < 768) {
      return 'mobile';
    } else if (width >= 768 && width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
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
    switch (deviceType) {
      case 'mobile':
        return {
          pairsPerRow: 2,
          maxCards: 12,
          cardSize: 'small'
        };
      case 'tablet':
        return {
          pairsPerRow: 4,
          maxCards: 16,
          cardSize: 'medium'
        };
      case 'desktop':
      default:
        return {
          pairsPerRow: 6,
          maxCards: 20,
          cardSize: 'large'
        };
    }
  };

  return {
    deviceType,
    ...getConfigForDevice()
  };
};