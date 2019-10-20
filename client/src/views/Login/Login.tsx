import React, { useState } from 'react';
import { CenteredPage, FormRow, Button, Panel, Form } from '@guardian/threads';
import { login } from '../../services/login';
import { useAuthState, setToken } from '../../state/AuthState';

export const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [_, dispatch] = useAuthState();

	return (
		<CenteredPage>
			<Panel title="Login">
				<Form
					onSubmit={() =>
						login(username, password).then(res => {
							dispatch(setToken(res.token));
						})
					}
				>
					<FormRow title="Username">
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Username"
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
							autoCapitalize="off"
							autoFocus
						/>
					</FormRow>
					<FormRow title="Password">
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</FormRow>
					<FormRow horizontal>
						<Button type="submit">Login</Button>
					</FormRow>
				</Form>
			</Panel>
		</CenteredPage>
	);
};
