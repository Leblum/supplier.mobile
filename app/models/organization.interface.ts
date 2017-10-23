import { IBaseModel } from "./index";
import * as enums from "../enumerations";

export interface IOrganization extends IBaseModel {
    _id?: string,
    ownerships?: {
        ownerId: string,
        ownershipType: enums.OwnershipType
    }[],
    name?: string,
    type?: enums.OrganizationType,
    isSystem?: boolean;
    users?: Array<string>;
    href?: string,
}