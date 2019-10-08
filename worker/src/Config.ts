export type Config = ReturnType<typeof getConfig>;

export const getConfig = () => {
	//const config = process.env['CONFIG_PATH']!;
	//const secrets = process.env['SECRETS_PATH']!;

	return {
		twitter: {
			consumerKey: '',
			consumerSecret: '',
			accessTokenKey: '',
			accessTokenSecret: '',
		},
		database: {
			host: 'localhost', //required(config, 'DB_HOST'),
			port: 9002, // Number(required(config, 'DB_PORT')),
			database: 'osmon', //required(config, 'DB_DATABASE'),
			user: 'osmon', //required(config, 'DB_USER'),
			password: 'osmon', //required(secrets, 'postgresql-password'),
		},
	};
};
