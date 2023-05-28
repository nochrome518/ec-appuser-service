import { AuthUser } from 'src/models/auth.user';

declare global{
    namespace Express {
        interface Request {
            user: AuthUser,
        }
    }
}
