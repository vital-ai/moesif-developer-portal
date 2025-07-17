import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { PageLoader } from "../page-loader";
import KeycloakError from "./KeycloakError";

const KeycloakSecureRoute = ({ children, errorComponent }) => {
  const { keycloak, initialized } = useKeycloak();
  const ErrorReporter = errorComponent || KeycloakError;

  if (!initialized) {
    return <PageLoader />;
  }

  if (keycloak.authenticated) {
    return children;
  }

  // Redirect to login if not authenticated
  keycloak.login();
  return <PageLoader />;
};

export default KeycloakSecureRoute;
