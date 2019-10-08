import { Response } from 'express';

// Can probably do this more cleanly with middleware
export const handleFailure = (res: Response, err: any, message: string) => {
	console.error(err);
	res.status(500).send(errorResponse(message));
};

export const errorResponse = (message: string) => {
	return {
		message,
	};
};
