"use client";

import { React, useState } from 'react'
import StandardButton from '../../components/StandardButton'
import { useRouter } from 'next/navigation';

const LandingPage = () => {


      // Step 1: Define state for both checkboxes
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  // Step 2: Handle checkbox state changes
  const handleCheckbox1Change = (event) => {
    setIsChecked1(event.target.checked);
  };

  const handleCheckbox2Change = (event) => {
    setIsChecked2(event.target.checked);
  };

  // Step 3: Button should be enabled only if both checkboxes are checked
  const isButtonDisabled = !(isChecked1 && isChecked2);


  const router = useRouter();
    const handleClick = () => { 
        router.push('/demographics')
    };



  return (
    <div className='w-full h-screen pt-36 bg-bg-100'>
        <p>What?</p>
        <p>Why?</p>
        <p>Terms and Conditions</p>
        <p>Privacy Policy</p>

        <input type='checkbox' defaultChecked={false} required={true} checked={isChecked1} onChange={handleCheckbox1Change}/>

        <input type='checkbox' defaultChecked={false} required={true} checked={isChecked2} onChange={handleCheckbox2Change}/>


        < StandardButton label={"Continue"} disabled={isButtonDisabled} onClick={handleClick}/>
    </div>
  )
}

export default LandingPage