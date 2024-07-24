export class Crypto {
	static async generateCacheKey(query: string): Promise<string> {
		const CryptoJS = await import('crypto-js');
		const hashing = CryptoJS.SHA256(query);
		return hashing.toString(CryptoJS.enc.Hex);
	}
}