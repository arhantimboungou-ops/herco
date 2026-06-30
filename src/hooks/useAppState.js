import { useState, useCallback, useRef } from 'react';

export const useAppState = (initialState) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);

  const updateState = useCallback((updates) => {
    setState((prevState) => {
      const newState = typeof updates === 'function' ? updates(prevState) : { ...prevState, ...updates };
      stateRef.current = newState;
      return newState;
    });
  }, []);

  return [state, updateState, stateRef];
};

export const useMemoizedList = (items, keyExtractor) => {
  const [memoized, setMemoized] = useState(items);
  const prevItemsRef = useRef(items);

  const updateList = useCallback((newItems) => {
    if (newItems !== prevItemsRef.current) {
      prevItemsRef.current = newItems;
      setMemoized(newItems);
    }
  }, []);

  return [memoized, updateList];
};
