import { ErrorCodesType } from '@core/types';

export class ErrorHandler {
	static handleCreateOrmConnection(error: unknown) {
		if (typeof error === 'string' && ErrorCodesType.some(code => error.includes(code))) {
			throw error;
		}
	}
}