export function useRamdonId() {
  const getId = () => Math.floor(Math.random() * new Date().getTime());
  return [getId];
}
