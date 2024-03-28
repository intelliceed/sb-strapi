'use client';

import { useRouter } from "next/navigation";
import { useSession } from "@/app/hooks/iron-session";

export default function SignIn () {
  const { login } = useSession();
  const router = useRouter();
  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    // sign in here
    await login({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    
    // NOTE: After Signing In/Out: Use window.location.href to ensure that any page the user navigates to next fully
    // reflects their new authentication state, fetching all data fresh from the server
    window.location.href = '/private/blog';
  };
  
  return <form onSubmit={handleSubmit}>
    <input
      name="email"
      type="email"
      defaultValue="serejabgdn@gmail.com"
    />
    <input
      name="password"
      type="password"
      defaultValue="Strapi1989999"
    />
    <button>Submit</button>
  </form>;
}
