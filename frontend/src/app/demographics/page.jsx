import React from 'react'
import StandardButton from '../src/components/StandardButton'
import { useRouter } from 'next/router';

const DemographicsPage = () => {
    const router = useRouter();
    
    const handleClick = () => { 
        router.push('/chat')
    };


  return (
    <div name='demograpichs' className='w-full h-screen pt-36 bg-bg-100 text-primary-500'>
        <p>Demographics explainations etc.</p>

        <StandardButton label={"Continue"} onClick={handleClick} />
    </div>
  )
}

export default DemographicsPage