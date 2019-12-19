import React, { useReducer, FC, ReactNode, useContext, Reducer } from 'react';

type AppState = {
	view: string;
	backViews: string[];
};

const initialState: AppState = {
	view: 'main',
	backViews: [],
};

const APP_SET_VIEW = 'APP_SET_VIEW';
const APP_BACK = 'APP_BACK';

// Actions
export const setView = (view: string, backView: string) => ({
	type: APP_SET_VIEW,
	view,
	backView,
});

export const back = () => ({
	type: APP_BACK,
});

// Reducer
const reducer = (state: AppState, action: any) => {
	switch (action.type) {
		case APP_SET_VIEW:
			return {
				...state,
				view: action.view,
				backViews: [...state.backViews, action.backView],
			};
		case APP_BACK:
			const last = state.backViews[state.backViews.length - 1];
			const remaining = state.backViews.slice(0, -1);
			return {
				...state,
				view: last,
				backViews: remaining,
			};
		default:
			return state;
	}
};

// Context
const AppContext = React.createContext<[AppState, any]>([
	initialState,
	reducer,
]);

// Provider helper
type AppProviderProps = {
	children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppState = () => useContext(AppContext);
