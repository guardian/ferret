import React, { useReducer, FC, ReactNode, useContext, Reducer } from 'react';
import { Project } from '@guardian/ferret-common';

type ProjectState = Project[];

const initialState: ProjectState = [];

const PROJECTS_SET_PROJECTS = 'PROJECTS_SET_PROJECTS';
// Actions
export const setProjects = (projects: Project[]) => ({
	type: PROJECTS_SET_PROJECTS,
	projects,
});

// Reducer
const reducer = (state: ProjectState, action: any) => {
	switch (action.type) {
		case PROJECTS_SET_PROJECTS:
			return action.projects;
		default:
			return state;
	}
};

// Context
const ProjectsContext = React.createContext<[ProjectState, any]>([
	initialState,
	reducer,
]);

// Provider helper
type ProjectsProviderProps = {
	children: ReactNode;
};

export const ProjectsProvider: FC<ProjectsProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<ProjectsContext.Provider value={[state, dispatch]}>
			{children}
		</ProjectsContext.Provider>
	);
};

export const useProjectsState = () => useContext(ProjectsContext);
