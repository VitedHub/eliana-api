import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class CookieSecurityService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.COOKIE_SECRET_KEY;
  }

  signCookie(value: string): string {
    const signature = createHmac('sha256', this.secretKey)
      .update(value)
      .digest('hex');

    return JSON.stringify(signature);
  }

  verifyCookieSignature(cookieValue: string, signature: string): boolean {
    const expectedSignature = createHmac('sha256', this.secretKey)
      .update(cookieValue)
      .digest('hex');

    return expectedSignature === signature;
  }
}
