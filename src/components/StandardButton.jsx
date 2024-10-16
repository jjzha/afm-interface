import React from 'react'
import PropTypes from 'prop-types'

const StandardButton = ({ label, onClick }) => {

  return (
    <div>
        <button name='standardbutton' onClick={ onClick } className='bg-primary-500 text-white text-sm font-light rounded-lg px-12 py-4 m-2 hover:scale-105'>
            { label }
        </button>
    </div>
  )
}

StandardButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
}

StandardButton.defaultProps = {
    onClick: () => {},
  };

export default StandardButton



 
  
