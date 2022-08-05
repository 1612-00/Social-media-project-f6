import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class StringUtil {
  /**
   * generates a random string
   * @function genRandomString
   * @param {number} length - Length of the random string.
   */
  public static genRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
