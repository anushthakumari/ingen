import React from "react";
import { useHistory } from "react-router-dom";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import CircularProgress from "@mui/material/CircularProgress";

import * as Components from "./Components";
import * as usersAPI from "../../apis/users.apis";
import localstorageKeys from "../../constants/localstorage.constants";
// import { app } from "../../configs/firebase.configs";

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

	const register = async (e) => {
		e.preventDefault();
		try {
			const name = e.currentTarget.name.value.trim();
			const email = e.currentTarget.email.value.trim();
			const pass = e.currentTarget.pass.value.trim();

			if (!/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/.test(name)) {
				alert("Invalid name, name should only contain alphabets!");
				return;
			}

			if (pass.length > 10 || pass.length < 4) {
				alert(
					"password should have minimum 4 characters and maximum 10 characters"
				);
				return;
			}

			setisLoading(true);

			const { data } = await usersAPI.register({
				email,
				pass,
				name,
			});
			localStorage.setItem(localstorageKeys.token, data.token);
			localStorage.setItem(localstorageKeys.role, data.role);
			setisLoading(false);
			history.push("/");
		} catch (error) {
			console.log(error);
			if (error.response) {
				alert(error.response.data.message);
			} else {
				alert("something went wrong!");
			}
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
					<Components.Form onSubmit={register}>
						<Components.Title>Create Account</Components.Title>
						<Components.Input
							type="text"
							name="name"
							placeholder="Name"
							required
						/>
						<Components.Input
							type="email"
							name="email"
							placeholder="Email"
							required
						/>
						<Components.Input
							type="password"
							name="pass"
							placeholder="Password"
							required
						/>
						<Components.Button disabled={isLoading}>
							{isLoading ? "Loading.." : "Sign Up"}
						</Components.Button>
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
						<Components.SignInDiv>
							<div class="google-btn">
								<div class="google-icon-wrapper">
									<img
										alt="google"
										class="google-icon"
										src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
									/>
								</div>
								<p class="btn-text">
									<b>Sign in with google</b>
								</p>
							</div>
						</Components.SignInDiv>
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
