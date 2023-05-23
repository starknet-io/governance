import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter  } from '@yukilabs/governance-backend/src/routers';

export const trpc = createTRPCReact<AppRouter>();
