'use client'
import { signIn } from 'next-auth/react';

export default function SignIn () {
    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();
        // sign in here
        const result = await signIn('credentials', {
            redirect: false,
            email: e.target.email.value,
            password: e.target.password.value,
        });
        console.log(result)
    }

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
    </form>
}
