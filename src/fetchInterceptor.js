export const interceptFetch = () => {
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    return originalFetch(...args)
      .then((response) => {
        if (response.status === 401) {
          response.json().then((data) => {
            if (
              data.error === "Invalid token." ||
              data.message === "No token provided"
            ) {
              // Marcar la sesión como expirada
              localStorage.clear();
              window.location.href = "/Login";
            }
          });
        }
        return response;
      })
      .catch((error) => {
        console.error("Error en la solicitud fetch:", error);
        throw error;
      });
  };

  console.log("Interceptor de fetch configurado.");
};

interceptFetch();
