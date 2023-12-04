import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/molecules/LoginForm';
import './register-style.css';

const LoginPage = () => {
    const router = useRouter();

    return(
        <div className='main'>
            <div className='left'>
                <LoginForm />
            </div>
            <div className='right'>
                
            </div>
        </div>
    );
}

export default LoginPage;