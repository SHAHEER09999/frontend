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

  const data: LoginResponse = await response.json();

  const token = response.headers.get("Authorization");

  if (token) {
    localStorage.setItem("token", token);
  }

  return data;
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

  return response.json();
};  