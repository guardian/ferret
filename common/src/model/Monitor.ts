export class Monitor {
	id: string;
	name: string;
	query: string;

	constructor(id: string, name: string, query: string) {
		this.id = id;
		this.name = name;
		this.query = query;
	}
}
