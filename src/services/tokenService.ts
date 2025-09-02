import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { randomId, sha256 } from '../utils/crypto.js';
import { RefreshToken } from '../models/RefreshToken.js';

export function signAccessToken(payload: Record<string, any>) {
  const secret: Secret = env.JWT_ACCESS_SECRET as unknown as Secret;
  // Casting مباشر لتفادي تضارب الـ overloads في typings
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES as any };
  return jwt.sign(payload, secret, options);
}

export async function issueRefreshToken(userId: string) {
  const jti = randomId(16);
  const secret: Secret = env.JWT_REFRESH_SECRET as unknown as Secret;
  // نفس الفكرة للrefresh
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES as any };
  const token = jwt.sign({ sub: userId, jti }, secret, options);

  const tokenHash = sha256(token);
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expMs = ((decoded?.exp ?? Math.floor(Date.now() / 1000) + 7 * 24 * 3600)) * 1000;

  await RefreshToken.create({ user: userId as any, jti, tokenHash, expiresAt: new Date(expMs) });
  return token;
}

export async function rotateRefreshToken(oldToken: string) {
  const secret: Secret = env.JWT_REFRESH_SECRET as unknown as Secret;
  try {
    const decoded = jwt.verify(oldToken, secret) as any;
    const tokenHash = sha256(oldToken);
    const doc = await RefreshToken.findOne({ user: decoded.sub, jti: decoded.jti, tokenHash });
    if (!doc || doc.revokedAt) throw new Error('Invalid refresh token');

    doc.revokedAt = new Date();
    await doc.save();

    const newToken = await issueRefreshToken(String(decoded.sub));
    return { userId: String(decoded.sub), newToken };
  } catch {
    throw new Error('Invalid refresh token');
  }
}
