import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton, InputAdornment, Stepper, Step, StepLabel, Snackbar, Alert, MenuItem } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import threePlImg from '../Assets/3pl_image.png'

import axios from "axios";
import { useFormContext } from "./Contexts/FormContext";

import LoadingButton from '@mui/lab/LoadingButton';

import { useNavigate } from "react-router-dom";



const ThirdPLLogin = () => {
    const naviagte = useNavigate();
    const [showPassword, setShowPassword] = useState(true);
    const steps = [
        'Account Information',
        'Verify Details',
        'OTP Authentication',
    ];
    const [stepNumber, setStepNumber] = useState(0);

    const PersonalDetailsForm = () => {
        const [snackBarVisibility, setSnackBarVisibility] = useState(false);
        const [snackBarMessage, setSnackBarMessage] = useState("Test Message");
        const [snackBarType, setSnackBarType] = useState("success");
        const [nextButtonLoading, setNextButtonLoading] = useState(false);

        const { formValues, updateFormValue } = useFormContext();

        const handleFormValues = (e) => {
            const { name, value } = e.target;
            updateFormValue(name, value);
        };

        const customSnackBar = () => (
            <Snackbar open={snackBarVisibility} autoHideDuration={6000} onClose={() => setSnackBarVisibility(false)}>
                <Alert onClose={() => setSnackBarVisibility(false)} severity={snackBarType} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        );

        return (

            <>

                {customSnackBar()}
                <TextField
                    type="text"
                    value={formValues.threeplName || ''}
                    name="threeplName"
                    label="3PL Name"
                    onChange={handleFormValues}
                    required
                />

                <TextField
                    type="email"
                    value={formValues.emailAddress || ''}
                    name="emailAddress"
                    label="Email Address"
                    onChange={handleFormValues}
                    required
                />

                <TextField
                    name="password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    type={showPassword ? "password" : "text"}
                    value={formValues.password || ''}
                    label="Password"
                    sx={{ marginBottom: "-10px" }}
                    onChange={handleFormValues}
                    required
                />

                <TextField
                    type="text"
                    value={formValues.headOfficeAddress || ''}
                    name="headOfficeAddress"
                    label="Head Office Address"
                    onChange={handleFormValues}
                    required
                />
                <LoadingButton
                    loading={nextButtonLoading}
                    type="submit"
                    style={{ marginTop: "10px", backgroundColor: "#ffd12d", fontFamily: "Poppins", color: "black" }}
                    onClick={() => {

                        /* VALIDATION LOGIC */



                        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                        //const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
                        if (!formValues.threeplName || !formValues.emailAddress || !formValues.password || !formValues.headOfficeAddress) {
                            setSnackBarMessage("All Fields Are Required");
                            setSnackBarType("warning");
                            setSnackBarVisibility(true);
                        } else if (!formValues.password.match(passRegex)) {
                            setSnackBarMessage("Weak Password : Minimum eight characters, at least one letter, one number and one special character is Required");
                            setSnackBarType("error");
                            setSnackBarVisibility(true);
                        } else if (!formValues.emailAddress.match(emailRegex)) {
                            setSnackBarMessage("Enter Valid Email");
                            setSnackBarType("error");
                            setSnackBarVisibility(true);
                        }

                        else {

                            const detailsValidator = async () => {
                                setNextButtonLoading(true);

                                try {
                                    const config = {
                                        headers: {
                                            "content-type": "application/json"
                                        }
                                    }
                                    const response = await axios.post("http://localhost:3001/api/step1", {
                                        name : formValues.threeplName,
                                        email : formValues.emailAddress,
                                        password : formValues.password,
                                        address : formValues.headOfficeAddress,
                                    }, config);
                                    setNextButtonLoading(false);
                                    setStepNumber((prev) => prev + 1);


                                }


                                catch (e) {
                                    setNextButtonLoading(false);

                                    setSnackBarMessage(e.response.data.msg);
                                    setSnackBarType("error");
                                    setSnackBarVisibility(true);
                                }

                            }
                            detailsValidator();
                            // setStepNumber(prev => prev + 1);
                        }

                    }
                    }
                    variant="contained"
                    disableElevation
                    size="large"
                >
                    PROCEED NEXT
                </LoadingButton>
                <p className="font-roboto text-sm text-center">
                    Already Registered?<b> <span onClick={() => {
                        naviagte("/")
                    }} style={{
                        cursor: "pointer",
                    }} className="text-[#ffd12d]"> Login In </span></b>
                </p>
            </>
        );
    };

    const AddressAndContactDetailsForm = () => {
        const { formValues, updateFormValue } = useFormContext();

        const handleFormValues = (e) => {
            const { name, value } = e.target;
            updateFormValue(name, value);
        };

        const [snackBarVisibility, setSnackBarVisibility] = useState(false);
        const [snackBarMessage, setSnackBarMessage] = useState("Test Message");
        const [snackBarType, setSnackBarType] = useState("success");

        const cities = ['City1', 'City2', 'City3']; // Add your cities here
        const states = ['State1', 'State2', 'State3']; // Add your states here
        const [nextButtonLoading,setNextButtonLoading] = useState(false);
        const customSnackBar = () => (
            <Snackbar open={snackBarVisibility} autoHideDuration={6000} onClose={() => { setSnackBarVisibility(false) }}>
                <Alert onClose={() => { setSnackBarVisibility(false) }} severity={snackBarType} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        );

        return (
            <>
                {customSnackBar()}
                <TextField
                    type="text"
                    name="GST_NUM"
                    value={formValues.GST_NUM || ''}
                    onChange={handleFormValues}
                    label="GST Number"
                    required
                />
                <TextField
                    type="text"
                    name="CIN_NUM"
                    value={formValues.CIN_NUM || ''}
                    onChange={handleFormValues}
                    label="CIN NUMBER"
                    required
                />
                {/* <TextField
                    type="text"
                    name="shopAddress"
                    value={formValues.shopAddress || ''}
                    onChange={handleFormValues}
                    label="Shop Address"
                /> */}


                <Button
                    type="submit"
                    style={{
                        backgroundColor: "#FFD12D",
                        fontFamily: "Poppins",
                        color: "black"
                    }}
                    onClick={() => {
                        //const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
                        /* Some Validaion Logic */
                        if ( !formValues.CIN_NUM || !formValues.GST_NUM) {
                            setSnackBarMessage("All Fields Are Required");
                            setSnackBarType("warning");
                            setSnackBarVisibility(true);
                        }

                        else {
                            const detailsValidator = async () => {
                                setNextButtonLoading(true);

                                try {
                                    const config = {
                                        headers: {
                                            "content-type": "application/json"
                                        }
                                    }
                                    const response = await axios.post("http://localhost:3001/api/step2", {
                                        GST_NUM : formValues.GST_NUM,
                                        CIN_NUM : formValues.CIN_NUM,
                                    }, config);
                                    setNextButtonLoading(false);
                                    setStepNumber((prev) => prev + 1);


                                }


                                catch (e) {
                                    setNextButtonLoading(false);

                                    setSnackBarMessage(e.response.data.msg);
                                    setSnackBarType("error");
                                    setSnackBarVisibility(true);
                                }

                            }
                            detailsValidator();
                        }
                    }}
                    variant="contained"
                    disableElevation
                    size="large"
                >
                    PROCEED NEXT
                </Button>
                <Button
                    type="submit"
                    style={{
                        marginTop: "-15px",
                        fontFamily: "Poppins",
                        color: "black"
                    }}
                    onClick={() => setStepNumber((prev) => prev - 1)}
                    variant="text"
                    sx={{
                        margin: "auto"
                    }}
                    disableElevation
                    size="small"
                >
                    Back
                </Button>
            </>
        );
    };

    const VerifyPhoneNumber = () => {

        const [snackBarVisibility, setSnackBarVisibility] = useState(false);
        const [snackBarMessage, setSnackBarMessage] =    useState("Test Message");
        const [snackBarType, setSnackBarType] = useState("success");
        const [verifyOtpLoading, setVerifyOtpLoading] = React.useState(false);
        const [sendOtpLoading, setSendOtpLoading] = React.useState(false);

        const { formValues, updateFormValue } = useFormContext();



        const customSnackBar = () => (
            <Snackbar open={snackBarVisibility} autoHideDuration={6000} onClose={() => setSnackBarVisibility(false)}>
                <Alert onClose={() => setSnackBarVisibility(false)} severity={snackBarType} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        );

       

        const onOtpVerify = async () => {

                const config = {

                    headers: {
                        "content-type": "application/json"
                    }

                }

                //console.log(formValues);
                const signUpUser = async () => {

                    try {
                        const response = await axios.post("http://localhost:3001/api/", {}, config);
                        setSnackBarMessage(`Signup Successfull`);
                        setSnackBarType("success");
                        setSnackBarVisibility(true);
                    }
                    catch (e) {
                        setSnackBarMessage(e.response.data.msg);
                        setSnackBarType("error");
                        setSnackBarVisibility(true);
                    }
                }

                await signUpUser();



                // ...
           
        }

        return (
            <div className="flex flex-col justify-center text-center">

                {customSnackBar()}
                <h1 className="text-2xl text-center m-4"> An OTP will be sent to your <b>registered email address</b> </h1>



                <div style={{ textAlign: "center" }} className="my-4" id="recaptcha-container"></div>
                <br />
                <hr />
                <div className="bg-slate-200 p-5 mt-10 mb-5 items-center flex flex-row justify-center rounded-md shadow-md">
                    {/* <OTPInput
                        autoFocus
                        value={OTP}
                        onChange={(e) => setOTP(e)}
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                    />  */}
                </div>
                <LoadingButton
                    loading={verifyOtpLoading}
                     onClick={onOtpVerify}
                    size="large"
                    disableElevation
                    variant="contained"
                    sx={{ fontFamily: "Poppins", backgroundColor: "#ffd12d", color: "black" }}
                >
                    Verify otp
                </LoadingButton>
                <LoadingButton
                    loading={verifyOtpLoading}
                    // onClick={onOtpVerify}
                    size="large"
                    disableElevation
                    variant="contained"
                    sx={{ fontFamily: "Poppins", backgroundColor: "white", color: "grey", marginTop: '10px' }}
                >
                    Resend OTP
                </LoadingButton>
                <Button
                    type="submit"
                    style={{ marginTop: "10px", fontFamily: "Poppins" }}
                    onClick={() => setStepNumber((prev) => prev - 1)}
                    variant="text"
                    disableElevation
                    sx={{ margin: "auto", color: "black" }}
                    size="small"
                >
                    Back
                </Button>
                <br />
                <p className="text-sm poppins-medium text-[#94989E] italic">
                    If you don’t receive the OTP within a few minutes, please check your spam or junk folder. You may also request a new OTP if needed.
                </p>
            </div>
        );
    };

    return (
        <>
            <h3 className="mx-4 my-2 px-2 py-2 text-lg font-poppins shadow-md rounded-md">Cargo<span className="text-[#dcb630]">Sync</span> </h3>
            <div className="flex  flex-row w-full h-full bg-[#FCFCFC] login-container">
                {/* form container */}
                <div className="p-5 sm:p-16 sm:basis-1/2 flex-col login-box">
                    {stepNumber == 0 ? <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-slate-700 tracking-widest poppins-regular">
                        <span className="font-medium text-[#dcb630] ">Register </span> as 3PL
                    </h1> : stepNumber == 1 ? <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-widest poppins-regular">

                        Just <span className="font-medium text-[#dcb630] ">One </span> Step Away{'>'}
                    </h1> : <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl tracking-widest poppins-regular">
                        <span className="font-medium text-[#dcb630] ">Almost </span> Done!
                    </h1>}
                    <div className="flex flex-col mt-10 gap-4 sm:mt-18 sm:gap-6">
                        <Stepper activeStep={stepNumber % 3} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel
                                        sx={{
                                            '& .MuiStepIcon-root': {
                                                color: stepNumber === steps.indexOf(label) || steps.indexOf(label) < stepNumber ? '#dcb630 !important' : 'default',
                                            },
                                            '& .MuiStepLabel-label': {
                                                color: stepNumber === steps.indexOf(label) || steps.indexOf(label) < stepNumber ? '#dcb630 !important' : 'default',
                                            },
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {stepNumber === 0 ? <PersonalDetailsForm /> : stepNumber === 1 ? <AddressAndContactDetailsForm /> : stepNumber === 2 ? <VerifyPhoneNumber /> : null}
                    </div>
                </div>
                {/* image container */}
                <div className="hidden sm:basis-1/2 md:block p-7 image-box">
                    <img src={threePlImg} className="login-img" alt="three-pl-image-cargo-truck" />
                </div>
            </div>
        </>);
};


export default ThirdPLLogin