import React, { useEffect, useReducer, useRef } from "react";
import {
  initialize,
  reducerDragComponent,
} from "../../reducer/components/games/dragComponentReducer";

const DragComponent = ({ children, styles, dragEndState, response }) => {
  const [state, dispatchDrag] = useReducer(reducerDragComponent, initialize());
  const containerRef = useRef(null);
  const dragItemRef = useRef(null);

  const setTranslate = (xPos, yPos, el) => {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  };

  useEffect(() => {
    let dragItem = dragItemRef.current;
    let container = containerRef.current;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      if (!state.lockResponse) {
        let initialX, initialY;
        dragItem.onselectstart = function () {
          return false;
        };
        let active;
        if (e.type === "touchstart") {
          initialX = e.touches[0].clientX - state.xOffset;
          initialY = e.touches[0].clientY - state.yOffset;
        } else {
          initialX = e.clientX - state.xOffset;
          initialY = e.clientY - state.yOffset;
        }
        active = true;
        dispatchDrag({
          type: "START_DRAG",
          data: {
            initialX,
            initialY,
            active,
          },
        });
      }
    }

    function dragEnd(e) {
      dragItem.classList.remove("active");
      container.classList.remove("active");

      dragEndState(dragItem, container, dispatchDrag, setTranslate, state);
      dispatchDrag({
        type: "END_DRAG",
        data: {
          initialX: state.currentX,
          initialY: state.currentY,
          active: false,
        },
      });
    }

    function drag(e) {
      if (state.active && e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
        let currentX;
        let currentY;
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - state.initialX;
          currentY = e.touches[0].clientY - state.initialY;
        } else {
          currentX = e.clientX - state.initialX;
          currentY = e.clientY - state.initialY;
        }

        setTranslate(currentX, currentY, dragItem);
        dispatchDrag({
          type: "ON_DRAG",
          data: {
            currentX,
            currentY,
            xOffset: currentX,
            yOffset: currentY,
          },
        });
      }
    }

    return () => {
      container.removeEventListener("touchstart", dragStart);
      container.removeEventListener("touchend", dragEnd);
      container.removeEventListener("touchmove", drag);

      container.removeEventListener("mousedown", dragStart);
      container.removeEventListener("mouseup", dragEnd);
      container.removeEventListener("mousemove", drag);
    };
  }, [state, dragEndState]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div data-word={response} ref={dragItemRef} className={styles.dragItem}>
        {children}
      </div>
    </div>
  );
};

export default DragComponent;
