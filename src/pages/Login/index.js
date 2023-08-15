import React from "react";
import { useHistory } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";

import * as Components from "./Components";
import * as usersAPI from "../../apis/users.apis";
import localstorageKeys from "../../constants/localstorage.constants";

function Login() {
	const [signIn, toggle] = React.useState(true);
	const [isLoading, setisLoading] = React.useState(false);
	const [email, setemail] = React.useState("");
	const [password, setpassword] = React.useState("");

	const history = useHistory();

	const login = async (e) => {
		e.preventDefault();
		try {
			setisLoading(true);
			const { data } = await usersAPI.login({
				email,
				password,
			});
			localStorage.setItem(localstorageKeys.token, data.token);
			localStorage.setItem(localstorageKeys.role, data.role);
			setisLoading(false);
			history.push("/");
		} catch (error) {
			alert("Invalid credentials!!");
			setisLoading(false);
		}
	};

	React.useEffect(() => {
		if (localStorage.getItem(localstorageKeys.token)) {
			history.push("/");
		}
	}, [history]);

	return (
		<div className="login-container">
			<Components.Container>
				<Components.SignUpContainer isLoadingIn={signIn}>
					<Components.Form>
						<Components.Title>Create Account</Components.Title>
						<Components.Input type="text" placeholder="Name" />
						<Components.Input type="email" placeholder="Email" />
						<Components.Input type="password" placeholder="Password" />
						<Components.Button>Sign Up</Components.Button>
					</Components.Form>
				</Components.SignUpContainer>

				<Components.SignInContainer signinIn={signIn}>
					<Components.Form onSubmit={login}>
						<Components.Title>Sign in</Components.Title>
						<Components.Input
							type="email"
							value={email}
							onChange={(e) => setemail(e.target.value)}
							placeholder="Email"
							required
						/>
						<Components.Input
							type="password"
							value={password}
							onChange={(e) => setpassword(e.target.value)}
							placeholder="Password"
							required
						/>
						<Components.Anchor href="#">
							Forgot your password?
						</Components.Anchor>

						<Components.Button type="submit" disabled={isLoading}>
							{isLoading ? <CircularProgress size={20} /> : null}
							Sigin In
						</Components.Button>
					</Components.Form>
				</Components.SignInContainer>

				<Components.OverlayContainer signinIn={signIn}>
					<Components.Overlay signinIn={signIn}>
						<Components.LeftOverlayPanel signinIn={signIn}>
							<Components.Title>Welcome Back!</Components.Title>
							<Components.Paragraph>
								To keep connected with us please login with your personal info
							</Components.Paragraph>
							<Components.GhostButton onClick={() => toggle(true)}>
								Sign In
							</Components.GhostButton>
						</Components.LeftOverlayPanel>

						<Components.RightOverlayPanel signinIn={signIn}>
							<Components.Title>Hello, Friend!</Components.Title>
							<Components.Paragraph>
								Enter Your personal details and start journey with us
							</Components.Paragraph>
							<Components.GhostButton onClick={() => toggle(false)}>
								Sigin Up
							</Components.GhostButton>
						</Components.RightOverlayPanel>
					</Components.Overlay>
				</Components.OverlayContainer>
			</Components.Container>
		</div>
	);
}

export default Login;
