export const formatPrice = (price) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price ?? 0);

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
};
