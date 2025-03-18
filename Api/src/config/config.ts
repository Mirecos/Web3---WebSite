export const JWT_SECRET = process.env.JWT_SECRET as string;
export const days_token_expiry = typeof process.env.TOKEN_EXPIRATION_DAYS == "number"?process.env.TOKEN_EXPIRATION_DAYS:7;
