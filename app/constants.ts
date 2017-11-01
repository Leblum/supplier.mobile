export const CONST = {
    ep: {
        API: '/api',
        V1: '/v1',
        AUTHENTICATE: '/authenticate',
        API_DOCS: '/api-docs',
        API_SWAGGER_DEF: '/swagger-definition',
        PERMISSIONS: '/permissions',
        ROLES: '/roles',
        USERS: '/users',
        RESTRICTED: '/restricted',
        UPGRADE: '/upgrade',
        UPDATE_PASSWORD: '/update-password',
        ORGANIZATIONS: '/organizations',
        REGISTER: '/register',
        EMAIL_VERIFICATIONS: '/email-verifications',
        PASSWORD_RESET: '/password-reset',
        PASSWORD_RESET_TOKENS: '/password-reset-tokens',
        VALIDATE_EMAIL: '/validate-email',
        PASSWORD_RESET_REQUEST: '/password-reset-request',
        PRODUCTS: '/products',
        SUPPLIERS: '/suppliers',
        QUERY: '/query',
        client: {
            VERIFY_EMAIL: '/verify-email',
            RESET_PASSWORD: '/reset-password'
        }
    },
    verbs: {
        PUT: 'PUT',
        PATCH: 'PATCH',
        POST: 'POST',
        DELETE: 'DELETE',
        GET: 'GET',
    },
    CLIENT_FIREBASE_PUSH_TOKEN: 'firebase-push-token',
    CLIENT_TOKEN_LOCATION: 'token',
    CLIENT_DECODED_TOKEN_LOCATION: 'decoded-token',
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