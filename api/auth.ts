import apiClient from "@/utils/apiClient";

export async function loginUser(
  username: string,
  password: string,
): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: new URLSearchParams({
        username,
        password,
      }),
    },
  );

  return response;
}
export async function logoutUser() {
  const response = await apiClient.get("/users/logout");

  // Optionally redirect to login page after successful logout
  if (response.status === 200) {
    window.location.href = "/login";
  }

  return response;
}

export async function me() {
  const response = await apiClient.get("/users/me");

  return response;
}

export async function googleAuthWithCH(queryString: string): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/access-token?${queryString}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return response;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    },
  );

  return response;
}
