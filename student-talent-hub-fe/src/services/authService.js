const BASE_URL = "http://127.0.0.1:8000/api";

export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    let errorMessage = "Failed to login";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Fallback if response is not <JSON></JSON>
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to register";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Fallback if response is not JSON
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};
