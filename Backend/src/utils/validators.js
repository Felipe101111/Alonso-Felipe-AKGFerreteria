export const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

export const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 8;

export const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
