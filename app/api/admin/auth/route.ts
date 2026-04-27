import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    const token = jwt.sign({ role: 'admin', iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
