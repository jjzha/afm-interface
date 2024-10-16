import React from 'react'
import StandardButton from '../components/StandardButton'


const LogIn = () => {
    const handleClick = () => { };

    return (
        <div name='login' className=' w-full h-screen bg-bg-100 text-tertiary-500'>
            
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