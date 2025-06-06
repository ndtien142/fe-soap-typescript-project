export interface IUser {
  userCode: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: string; // e.g., 'admin', 'user', etc.
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // Indicates if the user account is active
  profilePictureUrl?: string; // Optional field for user's profile picture
}
export interface ILoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: IUser;
}
