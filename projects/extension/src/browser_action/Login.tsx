import React, { useState } from 'react';
import { Button, Form, FormRow, Panel } from '@guardian/threads';

export const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	return (
		<Panel title="Ferret — Login">
			<Form onSubmit={() => {}}>
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
	);
};
