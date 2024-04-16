// outsource dependencies
import qs from "qs";

// local dependencies
import { getStrapiURL } from "./api-helpers";
import { SessionData } from "@/app/constants/iron-session";

type Options = {
  [key: string]: string | number | object | undefined,
  headers?: {
    'Content-Type'?: string,
    Authorization?: string,
  }
}

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

export async function clientFetchAPI (
  path: string,
  urlParamsObject = {},
  options: Options = {}
) {
  const { headers = {}, ...attr } = options;

  try {
    const { jwt } = await fetchJson<SessionData>(sessionApiRoute);

    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      ...attr,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    return await response.json();

  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}
