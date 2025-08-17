export async function loginUser(
  username: string,
  password: string,
): Promise<Response> {
  const response = await fetch("http://localhost:8080/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  return response;
}
export async function logoutUser(): Promise<Response> {
  const response = await fetch("http://localhost:8080/users/logout", {
    method: "GET",
    credentials: "include",
  });

  return response;
}

export async function me(): Promise<Response> {
  const response = await fetch("http://localhost:8080/users/me", {
    method: "GET",
    credentials: "include",
  });

  return response;
}
