import { useEffect } from "react";

const Logout: React.FC = () => {
  useEffect(() => {
    try {
      localStorage.removeItem("ADMIN_TOKEN");
      localStorage.removeItem("ADMIN_ROLES");
    } catch (_) {
      // ignore storage errors
    }
    // Redirect to home
    window.location.replace("/");
  }, []);

  return null;
};

export default Logout;

