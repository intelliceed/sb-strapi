// outsource dependencies
import axios from "axios";
import { cookies } from "next/headers";

// local dependencies
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/app/constants/iron-session";

export async function GET (request: Request, response: Response) {
  const urlObject = new URL(request.url);
  // Extract the search part, which includes the leading '?'
  const queryString = urlObject.search;
  const result = await axios.get(`http://local-strapi.ua/api/auth/google/callback/${queryString}`);

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!result?.data?.jwt) {
    return new Response(null, { status: 302, headers: { Location: '/sign-in' } });
  }
  session.isLoggedIn = true;
  session.jwt = result.data.jwt;
  await session.save();

  return new Response(null, { status: 302, headers: { Location: '/private/blog' } });
}
