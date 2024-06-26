import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// outsource dependencies
import { defaultSession, SessionData } from "@/app/constants/iron-session";

const sessionApiRoute = "/api/auth/iron-session";

async function fetchJson<JSON = unknown> (
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  }).then((res) => res.json());
}

function doLogin (url: string, { arg }: { arg: { email: string, password: string } }) {
  return fetchJson<SessionData>(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

function doLogout (url: string) {
  return fetchJson<SessionData>(url, {
    method: "DELETE",
  });
}

export function useSession () {
  const { data: session, isLoading } = useSWR(
    sessionApiRoute,
    fetchJson<SessionData>,
    {
      fallbackData: defaultSession,
    },
  );

  const { trigger: login } = useSWRMutation(sessionApiRoute, doLogin, {
    // the login route already provides the updated information, no need to revalidate
    // revalidate: false,
  });
  const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout);

  return { session, logout, login, isLoading };
}
