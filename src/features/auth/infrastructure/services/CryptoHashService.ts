import { CryptographyService } from '../../application/ports/CryptographyService';
import { createHash, randomBytes, createCipher, createDecipher } from 'crypto';

export class CryptoHashService implements CryptographyService {
  async hashForSession(data: string): Promise<string> {
    // Hash SHA-256 pour sécuriser les tokens en session côté client
    return createHash('sha256').update(data).digest('hex');
  }

  async verifySessionHash(data: string, hash: string): Promise<boolean> {
    const computedHash = await this.hashForSession(data);
    return computedHash === hash;
  }

  generateSecureRandom(length: number): string {
    return randomBytes(length).toString('hex');
  }

  async encrypt(data: string, key: string): Promise<string> {
    const cipher = createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  async decrypt(encryptedData: string, key: string): Promise<string> {
    const decipher = createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}