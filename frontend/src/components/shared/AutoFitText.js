import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

function clampNumber(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, value));
}

/**
 * AutoFitText
 * Ajusta el font-size para que el texto quepa en una sola línea dentro de su contenedor.
 * Si incluso con minPx no cabe, habilita wrap (2+ líneas) como fallback.
 */
export default function AutoFitText({
  as: Tag = "h3",
  text,
  className,
  maxPx = 36,
  minPx = 18,
  stepPx = 1,
  style,
  allowWrapFallback = true,
  ...rest
}) {
  const elementRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const rafIdRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(() => clampNumber(maxPx, minPx, maxPx));
  const [isWrapped, setIsWrapped] = useState(false);

  const normalizedText = useMemo(() => String(text ?? ""), [text]);

  function measureAndFit() {
    const el = elementRef.current;
    if (!el) return;

    // Reset a baseline antes de medir
    el.style.whiteSpace = "nowrap";
    el.style.wordBreak = "keep-all";
    el.style.overflowWrap = "normal";

    const availableWidth = el.clientWidth;
    if (!availableWidth) return;

    // Binary search para encontrar el mayor font-size que quepa
    let low = minPx;
    let high = maxPx;
    let best = minPx;

    const fits = (size) => {
      el.style.fontSize = `${size}px`;
      // scrollWidth incluye el contenido real
      return el.scrollWidth <= availableWidth;
    };

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (fits(mid)) {
        best = mid;
        low = mid + stepPx;
      } else {
        high = mid - stepPx;
      }
    }

    setFontSizePx((prev) => (prev === best ? prev : best));

    // Si ni con min cabe, habilitar wrap como fallback
    const stillOverflows = el.scrollWidth > availableWidth;
    if (allowWrapFallback && (stillOverflows || best === minPx)) {
      // Re-chequear overflow con el best aplicado
      el.style.fontSize = `${best}px`;
      const overflowAtBest = el.scrollWidth > availableWidth;
      if (overflowAtBest) {
        setIsWrapped((prev) => (prev === true ? prev : true));
        return;
      }
    }

    setIsWrapped((prev) => (prev === false ? prev : false));
  }

  useLayoutEffect(() => {
    measureAndFit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedText, maxPx, minPx, stepPx, allowWrapFallback]);

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          measureAndFit();
        });
      });
      resizeObserverRef.current.observe(el);
    } else {
      const onResize = () => measureAndFit();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch (e) {
          // ignore
        }
        resizeObserverRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mergedStyle = {
    ...style,
    fontSize: `${fontSizePx}px`,
    whiteSpace: isWrapped ? "normal" : "nowrap",
    overflowWrap: isWrapped ? "anywhere" : "normal",
    wordBreak: isWrapped ? "break-word" : "keep-all",
    lineHeight: isWrapped ? 1.05 : 1.1,
    margin: 0,
  };

  return (
    <Tag ref={elementRef} className={className} style={mergedStyle} {...rest}>
      {normalizedText}
    </Tag>
  );
}
