import express from 'express';
import ip from 'ip';
import { getConfig } from './services/config';
import { UkCompaniesHouseApi } from './services/ukCompaniesHouseApi';
import { companyConfig, officerConfig } from './sites/uk-companies-house';

async function main() {
	// Services
	const config = getConfig();

	const ukCompaniesHouseApi = new UkCompaniesHouseApi(config);

	const allSites = [
		companyConfig(ukCompaniesHouseApi),
		officerConfig(ukCompaniesHouseApi),
	];

	// Routes
	const port = 9999;
	const app = express();

	app.get('/sites', (req, res) => {
		res.json(allSites.map(({ processor, ...rest }) => rest));
	});

	app.get('/sites/:source/:id', async (req, res) => {
		const source = req.params.source;
		const id = req.params.id;

		const sourceConfig = allSites.find(s => s.name === source);

		if (sourceConfig) {
			res.json(await sourceConfig.processor(id));
		} else {
			res.status(404);
		}
	});

	app.get('/management/healthcheck', (req, res) => {
		res.send('OK');
	});

	// Launch! 🚀
	app.listen(port, () => {
		console.log(
			`✨ entity-integration listening on ${ip.address()}:${port} ✨`
		);
	});
}

if (require.main === module) {
	main();
}
