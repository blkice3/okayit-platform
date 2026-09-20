import 'next-auth';
import { UserRole, AccountStatus } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    displayName?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    status?: AccountStatus;
    careHomeId?: string | null;
    careHomeName?: string | null;
    userType?: string;
  }

  interface Session {
    user: {
      id: string;
      displayName: string;
      email?: string | null;
      role: UserRole;
      status: AccountStatus;
      careHomeId?: string | null;
      careHomeName?: string | null;
      userType?: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    displayName: string;
    role: UserRole;
    status: AccountStatus;
    careHomeId?: string | null;
    careHomeName?: string | null;
    userType?: string;
  }
}
