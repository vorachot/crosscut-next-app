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
