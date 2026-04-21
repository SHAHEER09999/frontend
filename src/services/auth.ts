import API_URL from "./api";

export interface LoginResponse {
  message?: string;
  user?: any;
}

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: { email, password },
    }),
  });

  const contentType = response.headers.get("content-type");

  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || "Login failed");
  }

  const token = response.headers.get("Authorization");

  if (!response.ok) {
    throw new Error(data.error || data.message || "Login failed");
  }

  return { data, token };
};

export const signup = async (
  email: string,
  password: string,
  role: string
) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
        password_confirmation: password,
        role,
      },
    }),
  });

  const contentType = response.headers.get("content-type");

  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || "Signup failed");
  }

  if (!response.ok) {
    throw new Error(data.errors || data.message || "Signup failed");
  }

  return data;
};