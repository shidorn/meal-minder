import axios from "axios";

export const storeTokens = (
  accessToken: string,
  refreshToken: string,
  email: string,
  username: string
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("email", email);
  localStorage.setItem("username", username);
};

export const getAccessToken = (): string | null =>
  localStorage.getItem("accessToken");

export const getRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken");

export const refreshToken = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
    window.location.href = "/login"; // Redirect to the login page
  }

  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/refresh-token",
      { refreshToken }
    );
    localStorage.setItem("accessToken", response.data.access_token);
  } catch (error) {
    console.log("Failed to refresh token", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    window.location.href = "/login";
  }
};

export const checkTokenExpiration = async (): Promise<void> => {
  const token = getAccessToken();
  // console.log(token);
  if (!token) {
    throw new Error("No access token available");
  }

  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = tokenPayload.exp * 1000;
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
    await refreshToken();
  }
};

export const setupTokenExpirationCheck = (): void => {
  setInterval(checkTokenExpiration, 60000);

  const originalAxiosRequest = axios.request;
  axios.request = async function (config) {
    await checkTokenExpiration();
    if (!config.headers) {
      config.headers = {}; // Initialize headers if undefined
    }
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return originalAxiosRequest(config);
  };
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_id");
  localStorage.removeItem("first_name");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  window.location.href = "/login"; // Redirect to the login page
};
