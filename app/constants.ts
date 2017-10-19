export const CONST = {
    ep: {
        AUTHENTICATE: '/authenticate',
        PERMISSIONS: '/permissions',
        ROLES: '/roles',
        USERS: '/users',
        ORGANIZATIONS: '/organizations',
        REGISTER: '/register',
        SUPPLIERS: '/suppliers',
        EMAIL_VERIFICATIONS: '/email-verifications',
        PASSWORD_RESET: '/password-reset',
        PASSWORD_RESET_TOKENS: '/password-reset-tokens',
        VALIDATE_EMAIL: '/validate-email',
        PASSWORD_RESET_REQUEST: '/password-reset-request',
        PRODUCTS: '/products',
    },
    CLIENT_TOKEN_LOCATION: 'token',
    CURRENT_USER_ID: 'current_user_id',
    MOMENT_DATE_FORMAT: 'YYYY-MM-DD h:mm:ss a Z',
    // These error codes are returned from the server to make it easier to programattically handle certain errrors.
    ErrorCodes: {
        EMAIL_TAKEN: 'EmailAlreadyTaken',
        PASSWORD_FAILED_CHECKS: 'PasswordFailedChecks',
        EMAIL_VERIFICATION_EXPIRED: 'EmailVerificationHasExpired',
        PASSWORD_RESET_TOKEN_EXPIRED: 'PasswordResetTokenExpired'
    }
}