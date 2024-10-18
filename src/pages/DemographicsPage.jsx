import React from 'react'
import StandardButton from '../components/StandardButton'
import { useNavigate } from 'react-router-dom';

const DemographicsPage = () => {
    const navigate = useNavigate();
    const handleClick = () => { 
        navigate('/chat')
    };


  return (
    <div name='demograpichs' className='w-full h-screen pt-36 bg-bg-100 text-primary-500'>
        <p>Demographics explainations etc.</p>

        <StandardButton label={"Continue"} onClick={handleClick} />
    </div>
  )
}

export default DemographicsPage