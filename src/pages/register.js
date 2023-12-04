import React from "react";
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/molecules/RegisterForm';
import './register-style.css';

const RegisterPage = () => {
    const router = useRouter();

    return (
        <div className="main">
            <div className="left">
                <RegisterForm />
            </div>
            <div className="right">

            </div>
        </div>
    );
}

export default RegisterPage;
