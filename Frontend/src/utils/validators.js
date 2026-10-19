export const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const isValidPassword = (password) => typeof password === "string" && password.length >= 8;
