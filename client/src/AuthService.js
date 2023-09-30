import Cookies from "js-cookie"; // Import the Cookies library

class AuthService {
  // Store access token in an HTTP-only, secure cookie
  static setAccessToken(accessToken) {
    Cookies.set("access_token", accessToken, {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      sameSite: "Strict",
      path: "/", // Set a broader path to make the cookie accessible from any path
      domain: "localhost", // Set the appropriate domain
    });
  }

  // Retrieve access token from cookies
  static getAccessToken() {
    return Cookies.get("access_token");
  }

  // Temporarily store the refresh token securely on the client side during authentication requests
  static setRefreshToken(refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  // Send the refresh token securely when needed
  static getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }

  // Clear refresh token on logout
  static clearRefreshToken() {
    localStorage.removeItem("refresh_token");
  }
}

export default AuthService;
