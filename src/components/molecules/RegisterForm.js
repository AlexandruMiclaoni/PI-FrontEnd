// Import necessary dependencies and components
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from "../atoms/LargeButton";
import './molecules-style.css';

const RegisterForm = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        // Reset previous error messages
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
    
        // check if all fields are completed
        if (firstName.trim() && lastName.trim() && email.trim() && password.trim()) {
            try {
                const response = await axios.post('http://localhost:3000/register/new-user', {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                });

                // Successful registration
                localStorage.setItem('token', response.data.token);
                if (email.includes('@gloevents.com')) {
                    router.push("/dashboard");
                  } else {
                    router.push("/");
                  }

            } catch (error) {
                console.error('API call error:', error);
            }
    
            // Clear the fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
        } else {
            // Validation for empty fields
            if (!firstName.trim()) {
                setFirstNameError('Please enter your first name.');
            }
            if (!lastName.trim()) {
                setLastNameError('Please enter your last name.');
            }
            if (!email.trim()) {
                setEmailError('Please enter your email.');
            }
            if (!password.trim()) {
                setPasswordError('Please enter your password.');
            }
        }
    };

    return (
        <div className="register-form">
            <h1>Create your account</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="names"> 
                    <div>
                        <Input
                            _onInputChange={(value) => setFirstName(value)}
                            _placeholder={"First Name"}
                        />
                        {firstNameError && <p className="error-message">{firstNameError}</p>}
                    </div>
                    <div>
                        <Input
                            _onInputChange={(value) => setLastName(value)}
                            _placeholder={"Last Name"}
                        />
                        {lastNameError && <p className="error-message">{lastNameError}</p>}
                    </div>
                </div>
                <div className="mid-fields">
                    <div>
                        <Input
                            _onInputChange={(value) => setEmail(value)}
                            _placeholder={"Mail"}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div>
                        <Input
                            _onInputChange={(value) => setPassword(value)}
                            _placeholder={"Password"}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Sign Up -->" _type="submit" />
                    <h3 onClick={() => router.push('/login')}><u>I already have an account {"->"}</u></h3>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
