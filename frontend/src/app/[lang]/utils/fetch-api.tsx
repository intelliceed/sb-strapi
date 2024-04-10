// outsource dependencies
import qs from "qs";

// local dependencies
import { getStrapiURL } from "./api-helpers";

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
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
