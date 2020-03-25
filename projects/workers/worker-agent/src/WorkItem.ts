type WorkItem = {
	task: string;
	// If true then this task will be run in an isolated container
	isolated: boolean;
	datasetId: string;
	object_location: string;
	languages: string[];
};
