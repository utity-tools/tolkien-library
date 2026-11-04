import { useLayoutEffect, useRef } from 'react';

/** Ref that always holds the latest value, for stable callbacks into imperative code. */
export const useLatest = <T,>(value: T) => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
