import { IAddress } from "../../app/models/address.interface";

export interface ISupplier {
    _id?: string,
    __v?: number,
    name?:string,
    slug?:string,
    companyEmail?: string,
    companyPhone?: string,
    companyAddress?: IAddress,
    pickupAddress?: IAddress,
    pickupName?: string,
    pickupPhone?: string,
    pickupEmail?: string,
    isApproved?: boolean,
    isActive?: boolean,
    href?:string,
    pushTokens?: Array<string>,
}