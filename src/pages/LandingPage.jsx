import React from 'react'
import StandardButton from '../components/StandardButton'

const LandingPage = () => {
  return (
    <div>
        <p>What?</p>
        <p>Why?</p>
        <p>Terms and Conditions</p>
        <p>Privacy Policy</p>

        <input type='checkbox' defaultChecked={false} required={true}/>

        <input type='checkbox' defaultChecked={false} required={true}/>


        < StandardButton label={"Start"} />
    </div>
  )
}

export default LandingPage