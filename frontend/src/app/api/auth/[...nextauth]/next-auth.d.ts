// File: /types/next-auth.d.ts
import 'next-auth';
import {DefaultSession} from "next-auth";

declare module 'next-auth' {
    /**
     * Extending Session type to include custom properties.
     */
    interface Session extends DefaultSession {
        id?: string;
        jwt?: string;
    }

    /**
     * Extending JWT type for consistency with the custom Session properties.
     */
    interface User {
        id?: string;
        jwt?: string;
    }
}
