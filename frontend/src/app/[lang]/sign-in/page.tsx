'use client';

// local dependencies
import { useSession } from "@/app/hooks/iron-session";

export default function SignIn () {
  const { login } = useSession();
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

  return <form onSubmit={handleSubmit} className="flex flex-col max-w-[240px] mx-auto">
    <input
      name="email"
      type="email"
      defaultValue="serejabgdn@gmail.com"
      className="border border-black mb-2 p-1 rounded-lg"
    />
    <input
      name="password"
      type="password"
      defaultValue="Strapi1989999"
      className="border border-black mb-2 p-1 rounded-lg"
    />
    <button
      className="bg-black mb-2 p-1 rounded-lg text-white hover:bg-gray-700 transition"
    >Submit</button>
    <a
      href="http://local-strapi.ua/api/connect/google"
      className="text-center bg-black mb-2 p-1 rounded-lg text-white hover:bg-gray-700 transition"
    >Gmail</a>
  </form>;
}
