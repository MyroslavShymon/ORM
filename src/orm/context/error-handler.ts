import { constants } from '@core/constants';

export class ErrorHandler {
	static handleCreateOrmConnection(error: unknown) {
		const errorCodes = Object.values(constants.errors).map(value => value.toString());
		if (typeof error === 'string' && errorCodes.some(code => error.includes(code))) {
			throw error;
		}

		throw error;
	}
}