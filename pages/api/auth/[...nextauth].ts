import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: "nextjs-app",
      clientSecret: "YwxnOlmBoyjSM5A58PBxOltiazLQZrma", // el secreto real
      issuer: "http://localhost:8080/realms/Sports-app",
    }),
  ],
  secret: "odioKeyCloak20000",
});
