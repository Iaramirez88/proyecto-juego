export const usePriceTitle = () => {
  const getPrice = (meses_precio) => {
    if (meses_precio === 0) return "Gratis";
    if (meses_precio === 1) return "Mensual";
    if (meses_precio === 3) return "Trimestral - 3 meses";
    if (meses_precio === 6) return "Semestral - 6 meses";
  };

  return getPrice;
};
