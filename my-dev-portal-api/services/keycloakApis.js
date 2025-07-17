const KcAdminClient = require('keycloak-admin').default;

// Initialize Keycloak Admin Client
const getKeycloakAdminClient = async () => {
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
  });

  try {
    // Authenticate with admin credentials
    await kcAdminClient.auth({
      username: process.env.KEYCLOAK_ADMIN_USERNAME,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli',
    });

    return kcAdminClient;
  } catch (error) {
    console.error('Failed to authenticate Keycloak admin client:', error);
    throw error;
  }
};

// Create a new user in Keycloak
const createKeycloakUser = async (userInfo) => {
  const { email, firstName, lastName, password } = userInfo;

  try {
    const kcAdminClient = await getKeycloakAdminClient();

    // Create user
    const user = await kcAdminClient.users.create({
      username: email,
      email: email,
      firstName: firstName,
      lastName: lastName,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    });

    console.log('User created successfully in Keycloak:', user);
    return user;
  } catch (error) {
    console.error('Error creating user in Keycloak:', error);
    throw error;
  }
};

// Get user by email
const getKeycloakUserByEmail = async (email) => {
  try {
    const kcAdminClient = await getKeycloakAdminClient();
    const users = await kcAdminClient.users.find({ email: email });
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error getting user from Keycloak:', error);
    throw error;
  }
};

// Update user in Keycloak
const updateKeycloakUser = async (userId, userInfo) => {
  try {
    const kcAdminClient = await getKeycloakAdminClient();
    await kcAdminClient.users.update({ id: userId }, userInfo);
    console.log('User updated successfully in Keycloak');
  } catch (error) {
    console.error('Error updating user in Keycloak:', error);
    throw error;
  }
};

// Assign role to user
const assignRoleToUser = async (userId, roleName) => {
  try {
    const kcAdminClient = await getKeycloakAdminClient();
    
    // Get the role
    const role = await kcAdminClient.roles.findOneByName({ name: roleName });
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    // Assign role to user
    await kcAdminClient.users.addRealmRoleMappings({
      id: userId,
      roles: [role],
    });

    console.log(`Role ${roleName} assigned to user ${userId}`);
  } catch (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
};

module.exports = {
  createKeycloakUser,
  getKeycloakUserByEmail,
  updateKeycloakUser,
  assignRoleToUser,
};
