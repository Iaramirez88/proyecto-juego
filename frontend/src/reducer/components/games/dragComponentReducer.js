export const initialize = () => {
  return {
    active: false,
    currentX: null,
    currentY: null,
    initialX: null,
    initialY: null,
    xOffset: 0,
    yOffset: 0,
    lockResponse: false,
    positionInitial: false,
    actualX: 0,
    actualY: 0,
  };
};

export const reducerDragComponent = (state, { type, data }) => {
  switch (type) {
    case "RESET_DRAG": {
      return {
        ...state,
        active: false,
        currentX: null,
        currentY: null,
        initialX: null,
        initialY: null,
        xOffset: 0,
        yOffset: 0,
        lockResponse: false,
        positionInitial: true,
      };
    }

    case "WRONG_ANSWER": {
      return {
        ...state,
        active: false,
        currentX: null,
        currentY: null,
        initialX: null,
        initialY: null,
        xOffset: 0,
        yOffset: 0,
        lockResponse: false,
        positionInitial: true,
        actualX: data.actualX,
        actualY: data.actualY,
      };
    }

    case "INITIAL_POSITION": {
      return {
        ...state,
        positionInitial: false,
        actualX: 0,
        actualY: 0,
      };
    }

    case "START_DRAG": {
      return {
        ...state,
        initialX: data.initialX,
        initialY: data.initialY,
        active: data.active,
      };
    }

    case "END_DRAG": {
      return {
        ...state,
        initialY: data.initialY,
        initialX: data.initialX,
        active: false,
      };
    }

    case "ON_DRAG": {
      return {
        ...state,
        xOffset: data.xOffset,
        yOffset: data.yOffset,
        currentX: data.currentX,
        currentY: data.currentY,
      };
    }

    case "LOCK_RESPONSE": {
      return {
        ...state,
        lockResponse: true,
        active: false,
      };
    }

    case "SET_DRAG_POSITION": {
      return {
        ...state,
        initialY: data.initialY,
        yOffset: data.yOffset,
        currentX: data.currentX,
        initialX: data.initialX,
        xOffset: data.xOffset,
        currentY: data.currentY,
        active: false,
      };
    }

    default:
      return state;
  }
};
