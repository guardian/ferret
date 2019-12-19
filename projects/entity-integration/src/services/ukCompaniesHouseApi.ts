import { Config } from './config';
import fetch from 'node-fetch';

export class UkCompaniesHouseApi {
	config: Config;

	constructor(config: Config) {
		this.config = config;
	}

	getCompany = async (id: string) => {
		const url = `${this.config.ukCompaniesHouse.apiUrl}company/${id}`;
		console.log(url)
		const res = await fetch(url, {
			headers: {
				Authorization:
					'Basic ' +
					Buffer.from(this.config.ukCompaniesHouse.apiKey).toString('base64'),
			},
		});
		const json = await res.json();
		// TODO  dig into .links.officers to get officers
		//const company: BasicCompany = {
		//	id: json.compnay_number,
		//	name: json.company_name,
		//}

		//const chAddress= json.registered_office_address;

		//const registeredOfficeAddress: BasicRealEstate = {
		//	address: `${chAddress.address_line_1} ${chAddress.locality} ${chAddress.country} ${chAddress.postal_code}`
		//}

		console.log(json);
		return json;
	};

	getOfficer = async (id: string) => {
		const res = await fetch(
			`${this.config.ukCompaniesHouse.apiUrl}/officer/${id}`,
			{
				headers: {
					Authorization:
						'Basic ' +
						Buffer.from(this.config.ukCompaniesHouse.apiKey).toString('base64'),
				},
			}
		);
		const json = res.json();
		console.log(json);
		return json;
	};
}
