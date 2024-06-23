// client/src/components/Sidebar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import getBackendUrl from '../utils/getBackendUrl';

const Sidebar = () => {
    console.log(getBackendUrl())
    const navigate = useNavigate(); // Used for redirecting after login
    const { login } = useAuth(); // Use the login function from AuthContext
    const [isLogin, setIsLogin] = useState(true);
    const [activeView, setActiveView] = useState('educator');
    const userTypeToggle = (view) => setActiveView(view);
    const [responseMessage, setResponseMessage] = useState('');

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setResponseMessage('');
    };
    
    const attemptLogin = async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${getBackendUrl()}/educator/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.user);
                navigate('/dashboard');
                setResponseMessage('Logged In!');
            } else {
                //logout(); // for later
                setResponseMessage(`Login failed: ${data.message}`);
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error(`Login error: ${error}`);
            setResponseMessage(`Login error: ${error}`);
        }
    };

    
    const handleCreateEducator = async () => {
        try {
            const username = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const response = await fetch(`${getBackendUrl()}/educator/create-educator`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                name: username,
                email: username,
                password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setResponseMessage(`Account created. You may login now!`);
                const usernameInput = document.getElementById("email");
                const passwordInput = document.getElementById("password");
                const pword2Input = document.getElementById("confirmPassword")
                // Set values to blank
                usernameInput.value = '';
                passwordInput.value = '';
                pword2Input.value = '';
                console.log(`Message set: ${responseMessage}`);

            } else {
                const errorMessage = await response.text();
                setResponseMessage(`Failed to create educator: ${errorMessage}`);
                alert("This username is already in use!");
                console.log(`Message set: ${responseMessage}`);
            }
        } 
        
        catch (error) {
            setResponseMessage(`Error creating educator: ${error.message}`);
        }
    };

    const validate = () => {
        var username = document.getElementById("email")
        var password = document.getElementById("password");
        var password2 = document.getElementById("confirmPassword");


        var lowerCaseLetters = /[a-z]/g;
        
        if(username.value.length < 3){
            alert("Username must be at least 3 characters long!");
            return;
        }

        if(!password.value.match(lowerCaseLetters)) {
            alert("You need at least 1 lowercase letter in your new password!");
            return;
        }


        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(!password.value.match(upperCaseLetters)) {
            alert("You need at least 1 capital letter in your new password!");
            return;
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if(!password.value.match(numbers)) {
            alert("You need at least 1 number in your new password!");
            return;
        }

        // Validate length
        if(!(password.value.length >= 8)) {
            alert("Your new password must have at least 8 characters!");
            return;
        }
        
        // Validate match
        if(password.value !== password2.value) {
            alert("Your passwords do not match!");
            return;
        }
        

        else{
            handleCreateEducator();
        }
    };

    const studentLogin = async () => {
        try {
            const code = document.getElementById("code").value;
            const url = `${getBackendUrl()}/games/checkClassCode`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,}),
            });
        

            if (response.ok) {
                const data = await response.json();
                setResponseMessage(`Game Found!`);
                window.location.href = '/play/' + code;
                // Clear input fields
                document.getElementById("code").value = '';
            } 
            
            else {
                const errorMessage = await response.text();
                setResponseMessage(`Failed to find game: ${errorMessage}`);
                alert("Game not Found!");
            }
        } 
        catch (error) {
            console.error(`Error during login: ${error.message}`);
            setResponseMessage(`Error during login: ${error.message}`);
        }
    };

    return (
        <div className='d-flex flex-column main-sidebar'>
            <div className='login-wrapper'>
                <div id='top'>
                    <button id='teacher-button' className={`button ${activeView === 'educator' ? 'active' : ''}`} onClick={() => userTypeToggle("educator")}>Teacher</button>
                    <button id='student-button' className={`button ${activeView === 'student' ? 'active' : ''}`} onClick={() => userTypeToggle("student")}>Student</button>
                </div>
                <div id='educator-logReg' style={{ display: activeView === 'educator' ? "flex" : "none" }}>
                {responseMessage && <div id='response-message'><p>{responseMessage}</p></div>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <input type="email" id="email" name="email" placeholder="Email" required />
                        </div>
                        <div>
                            <input type="password" id="password" name="password" placeholder='Password' required />
                        </div>
                        {isLogin ? (
                            <div className='login-register-submit'>
                                <button type="button" onClick={attemptLogin}>Login</button>
                            </div>
                        ) : (
                            <>
                                <div> 
                                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder='Confirm Password' required />
                                </div>
                                <div className='login-register-submit'>
                                    <button type="button" onClick={validate}>Register</button>
                                </div>
                            </>
                        )}
                    </form>
                    <div id='login-toggle'>
                        <button onClick={toggleForm}>{isLogin ? "Need an account? Register" : "Have an account? Login"}</button>
                    </div>
                </div>
                <div id='student-log' style={{ display: activeView === 'student' ? "flex" : "none" }}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <input type="text" id="code" name="code" placeholder='Class Code' required />
                        </div>
                        <div className='login-register-submit'>
                            <button type="button" onClick={studentLogin}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;