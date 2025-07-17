import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import React from "react";
import { useNavigate } from "react-router-dom";

export const KeycloakProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const keycloak = new Keycloak({
    url: import.meta.env.REACT_APP_KEYCLOAK_URL,
    realm: import.meta.env.REACT_APP_KEYCLOAK_REALM,
    clientId: import.meta.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  });

  const onEvent = (event, error) => {
    console.log("Keycloak event:", event, error);
  };

  const onTokens = (tokens) => {
    console.log("Keycloak tokens:", tokens);
  };

  const initOptions = {
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
    checkLoginIframe: false,
    flow: "standard",
    responseMode: "fragment",
    scope: "openid profile email",
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      onEvent={onEvent}
      onTokens={onTokens}
    >
      {children}
    </ReactKeycloakProvider>
  );
};
