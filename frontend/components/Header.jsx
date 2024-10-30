import React from 'react'
import whiteLogo from '../public/assets/AAU_HVID.png'
import Image from 'next/image'
//import IconButton from '../components/IconButton'
//import { PlusIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

const Header = () => {
    return (
        <div name='header' className='w-full inset-x-0 top-0 h-30 md:h-34 bg-primary-500 text-white '>
        <div className='flex flex-row m-2 justify-center items-center py-4 md:py-6 lg:py-8'>
            <div className='px-4 text-center'>
                <p className='text-base md:text-xl lg:text-2xl font-semibold'>Abundant Feedback Model</p>
                <p className='text-sm md:text-base lg:text-lg font-light'>Experimental Trial</p>
            </div>
                <div className='px-4'>
                    <img src="/assets/AAU_HVID.png" alt='AAU logo' style={{ height: '60px' }} />
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

