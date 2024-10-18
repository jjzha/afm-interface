import React from 'react'
import StandardButton from '../components/StandardButton'
import { useNavigate } from 'react-router-dom';


const LogIn = () => {

    const navigate = useNavigate();
    const handleClick = () => { 
        navigate('/landing');
    };

    return (
        <div name='login' className=' w-full h-screen pt-36 items-center justify-center bg-bg-100 text-tertiary-500 '>

            <div className=' flex flex-col items-center justify-around'>
                <div className='text-center font-light'>
                    <p className='text-base'>Welcome to the Abundant Feedback Model</p>
                    <p className='text-sm'>Use your AAU-login to continue</p>
                </div>
                <div>
                    <StandardButton label={"Log In"} onClick={handleClick} />
                </div>
            </div>
        </div>
    )
}

export default LogIn