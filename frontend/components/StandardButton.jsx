import React from 'react'
import PropTypes from 'prop-types'

const StandardButton = ({ label, onClick, disabled }) => {

  return (

        <button 
          name='standardbutton' 
          onClick={ onClick } 
          disabled={ disabled } 
          className='bg-primary-500 text-white text-sm font-light rounded-lg px-12 py-4 m-2 hover:scale-105
           disabled:bg-primary-300 disabled:cursor-not-allowed disabled:scale-100'
          >
            { label }
        </button>
  )
}

StandardButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
}

export default StandardButton



 
  
