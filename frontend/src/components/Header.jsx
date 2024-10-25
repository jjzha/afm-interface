import React from 'react'
import whiteLogo from '../assets/AAU_HVID.png'
import IconButton from './IconButton'
import { PlusIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

const Header = () => {
    return (
        <div name='header' className=' w-full inset-x-0 top-0 absolute h-34 bg-primary-500 text-white rounded-t-xl'>
            <div className='flex flex-row m-2 justify-center items-center py-7'>
                <div className='px-4 text-center'>
                    <p className='text-2xl font-semibold'>Abundant Feedback Model</p>
                    <p className='text-lg font-light'>Experimental Trial</p>
                </div>
                <div className='px-4'>
                    <img src={whiteLogo} alt='AAU logo' style={{ height: '60px' }} />
                </div>
            </div>
            {/*  
            < IconButton icon={ < PlusIcon className='stroke-primary-500'/> }/>
            < IconButton icon={RectangleStackIcon} /> 
            */}
        </div>
    )
}

export default Header

