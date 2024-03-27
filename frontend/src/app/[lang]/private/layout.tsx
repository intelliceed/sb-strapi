import { getServerSession } from "next-auth";
import { Debug } from "@/app/[lang]/components/Debug";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Layout ({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthOptions);
  console.log('SESSION', session);
  if (!session) {
    return '404';
  }
  return <div>
    <Debug session={session}></Debug>
    {children}
  </div>;
}
