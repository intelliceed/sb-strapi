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
  },
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

type mergedOptionsType = {
  next: {
    revalidate: number
  },
  headers: {
    "Content-Type": string,
    Authorization?: string | undefined,
  }
  body?: string,
  method: "GET" | "POST" | "PUT" | "DELETE"
}

export async function clientFetchAPI (
  path: string,
  options: Options = {}
) {
  const { headers = {}, body, params, ...attr } = options;

  const { jwt } = await fetchJson<SessionData>(sessionApiRoute);

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  const mergedOptions: mergedOptionsType = {
    method: 'GET',
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...attr,
  };

  if (["POST", "PUT", "DELETE"].includes(attr.method as string)) {
    mergedOptions.body = JSON.stringify(body);
  }

  // Build request URL
  const queryString = qs.stringify(params);
  const requestUrl = getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`);

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);
  const data = await response.json();

  return {
    data,
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  };
}
