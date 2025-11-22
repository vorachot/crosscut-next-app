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
export async function logoutUser(): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/logout`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return response;
}

export async function me(): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/me`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return response;
}

export async function googleAuthWithCH(code: string): Promise<Response> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/access-token?${code}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return response;
}
