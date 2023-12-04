import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from "../atoms/LargeButton";
import './molecules-style.css';

const LoginForm = () => { 
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Reset previous error messages
        setEmailError('');
        setPasswordError('');

        if (email && password) {
            try {
                const response = await axios.post('http://localhost:3000/register/login', {
                    mail: email,
                    password: password,
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);

                router.push({
                    pathname: '/',
                });
            } catch (error) {
                console.error(error);
                setPasswordError('Incorrect mail or password.');
            }

        } else {
            if (!email) {
                setEmailError('Please enter your email.');
            }
            if (!password) {
                setPasswordError('Please enter your password.');
            }
        }
    };

    return (
        <div className="register-form">
            <h1>Welcome back!</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mid-fields">
                    <Input
                        _onInputChange={(value) => setEmail(value)}
                        _placeholder={"Mail"}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                    <Input
                        _onInputChange={(value) => setPassword(value)}
                        _placeholder={"Password"}
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Sign In -->" _type="submit" />
                    <h3 onClick={() => {
                        router.push('/register');
                    }}><u>I don't have an account {"->"}</u></h3>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;