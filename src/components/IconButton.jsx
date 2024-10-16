import React from 'react'
import PropTypes from 'prop-types'

const IconButton = ({ icon, onClick }) => {
  return (

    <div className='bg-primary-50 h-10 w-10 rounded-lg p-2'>
        <button name='iconbutton' onClick= {onClick} className=''>
            hej
            { icon }
        </button>
    </div>
  )
}

IconButton.propTypes = {
    icon: PropTypes.object.isRequired  ,
    onClick: PropTypes.func,
}

IconButton.defaultProps = {
    icon: {},
    onClick: () => {},
  };

export default IconButton