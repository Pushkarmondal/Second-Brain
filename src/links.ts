
import  crypto  from 'node:crypto';

export function generateRandomHash(length = 10) {
      return crypto.randomBytes(length).toString('hex').slice(0, length);
}
