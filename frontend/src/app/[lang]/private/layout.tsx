import { Debug } from "@/app/[lang]/components/Debug";
import { getSession } from "@/app/api/auth/iron-session/route";

export default async function Layout ({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  console.log('yo', session);
  if (!session?.isLoggedIn) {
    return '404';
  }
  return <div>
    <Debug session={session}></Debug>
    {children}
  </div>;
}
