export interface IAuthenticationResponse{
    authenticated: boolean;
    message: string;
    expiresAt: string;
    token: string;
}