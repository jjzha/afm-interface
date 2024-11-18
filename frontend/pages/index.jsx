import React from 'react'
import StandardButton from '@components/StandardButton';
import { useRouter } from 'next/router';
import chatConfig from '../interfaceConfig';



const LogIn = () => {

    const router = useRouter();


    const handleClick = () => { 
        router.push('/chat')
    };

    return (
        <div name='login' className=' w-full h-full flex flex-col items-center justify-center bg-bg-100 text-tertiary-500 '>

            <div className=' flex flex-col items-center justify-around space-y-8'>
                <div className='text-center font-light space-y-6'>
                    <p className='text-base'>Welcome to the {chatConfig.header.title}</p>
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