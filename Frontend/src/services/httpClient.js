const BASE_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, { method = "GET", body, auth = false, headers = {} } = {}) => {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Ocurrió un error inesperado. Intentá nuevamente.");
  }

  return payload?.data ?? payload;
};

export default request;
export { BASE_URL };
