import React, { useReducer, FC, ReactNode, useContext, Reducer } from 'react';
import { User } from '@guardian/ferret-common';
import { setAuthToken } from '../services/authFetch';

type AuthState = {
	token?: string;
	user?: User;
};

const initialState: AuthState = {
	token: undefined,
	user: undefined,
};

const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';
// Actions
export const setToken = (token?: string) => ({
	type: AUTH_SET_TOKEN,
	token,
});

// Reducer
const reducer = (state: AuthState, action: any) => {
	switch (action.type) {
		case AUTH_SET_TOKEN:
			setAuthToken(action.token);
			return {
				...state,
				token: action.token,
			} as AuthState;
		default:
			return state;
	}
};

// Context
const AuthContext = React.createContext<[AuthState, any]>([
	initialState,
	reducer,
]);

// Provider helper
type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AuthContext.Provider value={[state, dispatch]}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthStateValue = () => useContext(AuthContext);
