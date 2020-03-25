import React, {
	useReducer,
	FC,
	ReactNode,
	useContext,
	Reducer,
	useEffect,
} from 'react';
import { User } from '@guardian/ferret-common';
import { setAuthToken } from '../services/authFetch';
import jwtDecode from 'jwt-decode';

type AuthState = {
	checkStorage: boolean;
	token?: string;
	user?: User;
};

const initialState: AuthState = {
	checkStorage: true,
	token: undefined,
	user: undefined,
};

const AUTH_INIT = 'AUTH_INIT';
const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';
const AUTH_CLEAR_TOKEN = 'AUTH_CLEAR_TOKEN';

// Actions
export const init = () => ({
	type: AUTH_INIT,
});

export const setToken = (token?: string) => ({
	type: AUTH_SET_TOKEN,
	token,
});

export const clearToken = () => ({
	type: AUTH_CLEAR_TOKEN,
});

// Reducer
const reducer = (state: AuthState, action: any) => {
	switch (action.type) {
		case AUTH_INIT:
			const maybeToken = window.localStorage.getItem('ferret-auth');
			if (maybeToken) {
				setAuthToken(maybeToken);
				return {
					...state,
					user: jwtDecode(maybeToken) as User,
					token: maybeToken,
					checkStorage: false,
				};
			}
			return {
				...state,
				checkStorage: false,
			};

		case AUTH_SET_TOKEN:
			// Set the auth token for authFetch
			setAuthToken(action.token);
			window.localStorage.setItem('ferret-auth', action.token);
			return {
				...state,
				user: jwtDecode(action.token) as User,
				token: action.token,
			};

		case AUTH_CLEAR_TOKEN:
			window.localStorage.removeItem('ferret-auth');
			return initialState;
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

type Event = 'logout';
type EventHandler = (event: Event) => void;

const eventHandlers: EventHandler[] = [];

export const getEventDispatchers = () => {
	return {
		logout: () => {
			eventHandlers.forEach(handler => {
				handler('logout');
			});
		},
	};
};

const listenForEvents = (cb: EventHandler) => {
	eventHandlers.push(cb);
};

export const AuthProvider: FC<AuthProviderProps> = function({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		listenForEvents(event => {
			if (event === 'logout') {
				dispatch(clearToken());
			}
		});
	}, []);

	if (state.checkStorage) {
		console.log('Initialising auth');
		dispatch(init());
	}

	// register some callback here

	return (
		<AuthContext.Provider value={[state, dispatch]}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthState = () => useContext(AuthContext);
