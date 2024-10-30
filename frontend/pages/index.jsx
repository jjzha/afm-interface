import React from 'react'
import StandardButton from '../components/StandardButton'
import { useRouter } from 'next/router';



const LogIn = () => {

    const router = useRouter();


    const handleClick = () => { 
        router.push('/chat')
    };

    return (
        <div name='login' className=' w-full items-center justify-center bg-bg-100 text-tertiary-500 '>

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