import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../page-loader";

function KeycloakLogin() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized) {
      if (keycloak.authenticated) {
        // User is already authenticated, redirect to dashboard
        navigate("/dashboard");
      } else {
        // Initiate login
        keycloak.login();
      }
    }
  }, [initialized, keycloak, navigate]);

  if (!initialized) {
    return <PageLoader />;
  }

  return (
    <div>
      <h1>Redirecting to Keycloak...</h1>
      <PageLoader />
    </div>
  );
}

export default KeycloakLogin;
