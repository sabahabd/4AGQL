import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: number;
	email: string;
	role: string;
}

export interface RequestHeaders {
	[key: string]: string | string[] | undefined;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
	(process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ?? "7d";

export function generateAccessToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function getBearerToken(headers?: RequestHeaders): string | null {
	if (!headers) {
		return null;
	}

	const headerValue = headers.authorization;
	const authorization = Array.isArray(headerValue) ? headerValue[0] : headerValue;

	if (!authorization || !authorization.startsWith("Bearer ")) {
		return null;
	}

	const token = authorization.slice(7).trim();
	return token.length > 0 ? token : null;
}

export function getAuthenticatedUserId(headers?: RequestHeaders): number | null {
	const token = getBearerToken(headers);

	if (!token) {
		return null;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			userId?: number;
			sub?: number | string;
		};

		if (typeof decoded.userId === "number") {
			return decoded.userId;
		}

		if (typeof decoded.sub === "number") {
			return decoded.sub;
		}

		if (typeof decoded.sub === "string") {
			const parsed = Number(decoded.sub);
			return Number.isNaN(parsed) ? null : parsed;
		}
	} catch {
		return null;
	}

	return null;
}
