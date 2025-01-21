import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Checkbox, CircularProgress, CssBaseline, FormControlLabel, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha"; // <-- Import reCAPTCHA
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn'; // Password strength checker library
import Popup from '../components/Popup';
import { authUser } from '../redux/userHandle';
import { LightPurpleButton } from '../utils/buttonStyles';

const AuthenticationPage = ({ mode, role }) => {

    const bgpic = "https://images.pexels.com/photos/1121097/pexels-photo-1121097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null); // Store captcha value

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [userNameError, setUserNameError] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        if (!captchaValue) {  // Check if CAPTCHA is completed
            setMessage("Please complete the CAPTCHA.");
            setShowPopup(true);
            return;
        }

        if (mode === "Register") {
            const name = event.target.userName.value;

            if (!name) {
                setUserNameError(true);
                return;
            }

            if (role === "Seller") {
                const shopName = event.target.shopName.value;

                if (!shopName) {
                    setShopNameError(true);
                    return;
                }

                const sellerFields = { name, email, password, role, shopName };
                dispatch(authUser(sellerFields, role, mode));
            } else {
                const customerFields = { name, email, password, role };
                dispatch(authUser(customerFields, role, mode));
            }
        } else if (mode === "Login") {
            const fields = { email, password };
            dispatch(authUser(fields, role, mode));
        }
        setLoader(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') {
            setPasswordError(false);
            assessPasswordStrength(value); // Check strength on input change
        }
        if (name === 'userName') setUserNameError(false);
        if (name === 'shopName') setShopNameError(false);
    };

    const assessPasswordStrength = (password) => {
        const result = zxcvbn(password);
        setPasswordStrength(result.score); // Get the strength score
    };

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);  // Set the captcha value when completed
    };

    useEffect(() => {
        if (status === 'success' && currentRole !== null) {
            navigate('/');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <StyledTypography>
                            {role} {mode}
                        </StyledTypography>

                        {role === "Seller" && mode === "Register" && (
                            <Typography variant="h7">
                                Create your own shop by registering as a seller.
                                <br />
                                You will be able to add products and sell them.
                            </Typography>
                        )}

                        {role === "Customer" && mode === "Register" && (
                            <Typography variant="h7">
                                Register now to explore and buy products.
                            </Typography>
                        )}

                        {mode === "Login" && (
                            <Typography variant="h7">
                                Welcome back! Please enter your details.
                            </Typography>
                        )}

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {mode === "Register" && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Enter your name"
                                    name="userName"
                                    autoComplete="name"
                                    autoFocus
                                    variant="standard"
                                    error={userNameError}
                                    helperText={userNameError && 'Name is required'}
                                    onChange={handleInputChange}
                                />
                            )}
                            {mode === "Register" && role === "Seller" && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="shopName"
                                    label="Create your shop name"
                                    name="shopName"
                                    autoComplete="off"
                                    variant="standard"
                                    error={shopNameError}
                                    helperText={shopNameError && 'Shop name is required'}
                                    onChange={handleInputChange}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                variant="standard"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                variant="standard"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            {/* Password Strength Assessment (Only for Register mode) */}
                            {mode === "Register" && passwordStrength !== undefined && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: passwordStrength === 4 ? 'green' : passwordStrength > 0 ? 'red' : 'black'
                                    }}
                                >
                                    {passwordStrength === 4
                                        ? "Password is strong!"
                                        : passwordStrength > 0
                                        ? "Password is weak. Try using a mix of letters, numbers, and symbols."
                                        : ""
                                    }
                                </Typography>
                            )}

                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </Grid>

                            {/* Add reCAPTCHA component */}
                            <ReCAPTCHA
                                sitekey="6LdjS7sqAAAAAGbSewbMxGFpVyEoVK7CMAHwsCjc" // Replace with your reCAPTCHA site key
                                onChange={onCaptchaChange}
                            />

                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : mode}
                            </LightPurpleButton>
                            <Grid container>
                                <Grid>
                                    {mode === "Register" ? "Already have an account?" : "Don't have an account?"}
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    {mode === "Register" ? (
                                        <StyledLink to={`/${role}login`}>Log in</StyledLink>
                                    ) : (
                                        <StyledLink to={`/${role}register`}>Sign up</StyledLink>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AuthenticationPage;

const StyledLink = styled(Link)`
    margin-top: 9px;
    text-decoration: none;
    color: #7f56da;
`;

const StyledTypography = styled.h4`
    margin: 0;
    font-weight: 400;
    font-size: 2.125rem;
    line-height: 1.235;
    letter-spacing: 0.00735em;
    color: #2c2143;
    margin-bottom: 16px;
`;
