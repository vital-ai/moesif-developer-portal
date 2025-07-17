import React from "react";

const KeycloakError = ({ error }) => (
  <div>
    <h1>Keycloak Authentication Error</h1>
    <p>{error?.message || "An authentication error occurred"}</p>
  </div>
);

export default KeycloakError;
