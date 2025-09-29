export interface CryptographyService {
  hashForSession(data: string): Promise<string>;
  verifySessionHash(data: string, hash: string): Promise<boolean>;
  generateSecureRandom(length: number): string;
  encrypt(data: string, key: string): Promise<string>;
  decrypt(encryptedData: string, key: string): Promise<string>;
}