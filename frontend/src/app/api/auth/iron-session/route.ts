// outsource dependencies
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getIronSession } from "iron-session";

// local dependencies
import { signIn } from '@/services/auth';
import { defaultSession, SessionData, sessionOptions } from "@/app/constants/iron-session";

// login
export async function POST (request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const req = await request.json();
  const token = await signIn(req);

  session.isLoggedIn = true;
  session.jwt = token.jwt;
  await session.save();

  return Response.json(session);
}

// read session
export async function GET () {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// logout
export async function DELETE () {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();
  return Response.json(defaultSession);
}

export async function getSession () {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return !session.isLoggedIn ? defaultSession : session;
}
