// outsource dependencies
import qs from "qs";

// local dependencies
import { getStrapiURL } from "./api-helpers";
import { getSession } from "@/app/api/auth/iron-session/route";

type Options = {
  [key: string]: string | number | object | undefined,
  headers?: {
    'Content-Type'?: string,
    Authorization?: string,
  }
}

export async function fetchAPI (
  path: string,
  urlParamsObject = {},
  options: Options = {}
) {
  const { headers = {}, ...attr } = options;
  // TODO remove this everywhere
  // const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  try {
    const { jwt } = await getSession();
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    // Merge default and user options
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
