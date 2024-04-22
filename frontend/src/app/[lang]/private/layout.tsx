// local dependencies
import { getSession } from "@/app/api/auth/iron-session/route";

export default async function Layout ({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // NOTE there is an example how to get a session with fetch below
/*  const cookieStore = cookies();
  const session = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/api/auth/iron-session`, {
    headers: {
      // Forward the cookies with the request
      'Cookie': cookieStore.getAll().reduce((acc, { name, value }) => {
        acc += `${name}=${value};`;
        return acc;
      }, '')
    }
  }).then(r => r.json());*/

  if (!session?.isLoggedIn) {
    return '404';
  }
  return <div className="private-layout">{children}</div>;
}
