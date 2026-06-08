'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

export interface CartItem {
  id: string;
  categoryId: string;
  categoryName: string;
  proofId: string;
  proofName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; unitPrice: number; total: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD'; payload: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? action.payload : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity, unitPrice: action.payload.unitPrice, total: action.payload.total }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  vat: number;
  grandTotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, unitPrice: number, total: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = 'sidekick_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        dispatch({ type: 'LOAD', payload: JSON.parse(raw) as CartState });
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number, unitPrice: number, total: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, unitPrice, total } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem(CART_KEY);
  }, []);

  const subtotal = state.items.reduce((sum, i) => sum + i.total, 0);
  const vat = subtotal * 0.2;
  const grandTotal = subtotal + vat;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount: state.items.length,
        subtotal,
        vat,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
