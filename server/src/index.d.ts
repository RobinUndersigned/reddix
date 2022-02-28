export interface AuthUserProfile {
  id: number,
  bio: string,
  avatarId: number,
}

declare global {
  namespace Express {
    interface User {
      id: number,
      firstName: string,
      lastName: string,
      userName: string,
      email: string;
      Profile: AuthUserProfile
    }
  }
}