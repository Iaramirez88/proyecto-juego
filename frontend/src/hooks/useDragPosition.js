export function useDragPosition() {
  const isInPosition = (containerResponse, dragItem) => {
    let { top, right, left, bottom } =
      containerResponse.getBoundingClientRect();
    let positionResponse = dragItem.getBoundingClientRect();
    if (left <= positionResponse.left && right >= positionResponse.left) {
      if (top <= positionResponse.top && bottom >= positionResponse.top) {
        // setear posicion de respuesta
        return true;
      } else if (
        top <= positionResponse.bottom &&
        bottom >= positionResponse.bottom
      ) {
        // setear posicion respuesta
        return true;
      }
    } else if (
      left <= positionResponse.right &&
      right >= positionResponse.right
    ) {
      if (top <= positionResponse.top && bottom >= positionResponse.top) {
        // setear posicion de respuesta
        return true;
      } else if (
        top <= positionResponse.bottom &&
        bottom >= positionResponse.bottom
      ) {
        // setear posicion respuesta
        return true;
      }
    }
    return false;
  };

  return [isInPosition];
}
