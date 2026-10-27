import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem("carrito")) ?? [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getStoredCart);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  // Devuelve la cantidad realmente guardada (limitada por el stock).
  const addItem = (producto, cantidad) => {
    const existente = items.find((item) => item.productoId === producto.id);
    const nueva = Math.min((existente?.cantidad ?? 0) + cantidad, producto.stock);

    setItems((actuales) => {
      const resto = actuales.filter((item) => item.productoId !== producto.id);
      return [
        ...resto,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          cantidad: nueva,
        },
      ];
    });
    return nueva;
  };

  const updateQuantity = (productoId, cantidad) => {
    setItems((actuales) =>
      actuales.map((item) =>
        item.productoId === productoId
          ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) }
          : item,
      ),
    );
  };

  const removeItem = (productoId) => {
    setItems((actuales) => actuales.filter((item) => item.productoId !== productoId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const count = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
