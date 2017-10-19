export enum SignupSteps{
    name = 1,
    email = 2, 
    phone = 3,
    password = 4,
    companyInfo = 5,
    pickupDetails = 6,
    teamUrl = 7,
    agreeToTerms = 8,
    submitData = 9,
    thankYou = 10
}

export enum AddressType{
    pickup = 1,
    business = 2,
    billing = 3,
}

export const MimeType = {
    JSON: 'application/json',
    MULTIPART: 'multipart/form-data',
    TEXT: 'text/plain'
};

export enum NotificationType {
    info = 1,
    success = 2,
    validationError = 3,
    danger = 4,
    empty = 5,
    warning = 6,
}