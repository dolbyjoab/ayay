// functions/identity-login.js
exports.handler = async function (event, context) {
  const { identity, user } = context.clientContext;

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "No user found" }),
    };
  }

  // Log user details (e.g., for debugging or analytics)
  console.log("User logged in:", {
    id: user.id,
    email: user.email,
    name: user.user_metadata.full_name,
  });

  // Optionally update user metadata (e.g., assign a role)
  return {
    statusCode: 200,
    body: JSON.stringify({
      user: {
        ...user,
        app_metadata: {
          ...user.app_metadata,
          roles: user.app_metadata.roles || ["user"], // Example: Assign 'user' role
        },
      },
    }),
  };
};