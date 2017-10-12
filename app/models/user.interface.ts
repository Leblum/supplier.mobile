import { IRole } from './role.interface';

export interface IUser {
    _id?:string,
    firstName?: string,
    lastName?: string,
    password?: string;
    email?: string;
    phone?: string;
    organizationId?: string; // Nullable for now as we don't have to have an org id on login.  we'll get that later.
    href?: string;
    // This will be set to true whenever a user changes their password / or we require them to login again
    // This is used by the authentication controller to revoke the renewal of a token.  
    isEmailVerified?: boolean;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}