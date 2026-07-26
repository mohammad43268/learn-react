import React, { createContext, useReducer, useEffect } from 'react';

export const DataContext = createContext();

const initialState = {
  items: [],
  loading: true,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
}

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Simulate data fetching
  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });
    const timer = setTimeout(() => {
      const mockData = [
        { id: 1, title: 'Learn React Hooks', completed: true },
        { id: 2, title: 'Master Context API', completed: false },
        { id: 3, title: 'Build a premium UI', completed: false },
      ];
      dispatch({ type: 'FETCH_SUCCESS', payload: mockData });
    }, 1500); // simulate network delay
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
