import { ITokenPayload } from "../../app/models/token-payload.interface";

export interface IAuthenticationResponse{
    authenticated: boolean;
    message: string;
    expiresAt: string;
    token: string;
    decoded: ITokenPayload
}