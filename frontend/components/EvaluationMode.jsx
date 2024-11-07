import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ThumbDown, ThumbUp } from 'geist-icons';
import clsx from 'clsx';

const EvaluationMode = ({ evaluationName, evaluationType }) => {
  // State to keep track of the user's selected value
  const [value, setValue] = useState(null);

  return (
    <div className="px-6 py-3 bg-primary-50 rounded-lg w-full max-w-md text-center text-primary-500">
      <p className="text-xs mb-2">{evaluationName}</p>

      {evaluationType === 'scale' && (
        <div className="flex justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <button
                className={`w-3 h-3 rounded-full ${value === num ? 'bg-primary-500' : 'border border-primary-500'}`}
                onClick={() => setValue(num)}
              />
              <span className="text-xs mt-1">{num}</span>
            </div>
          ))}
        </div>
      )}

      {evaluationType === 'thumbs' && (
        <div className="flex space-x-4 justify-center">
          {/* Thumbs Up Button */}
          <button
            onClick={() => setValue('thumbs-up')}
          >
            <div
              className={clsx(
                'rounded-full p-2 flex items-center justify-center transition-all duration-300',
                value === 'thumbs-up' ? 'bg-primary-500 text-white' : 'bg-transparent text-primary-500'
              )}
            >
              <ThumbUp
                size={16}
                
              />
            </div>
          </button>

          {/* Thumbs Down Button */}
          <button
            onClick={() => setValue('thumbs-down')}
          >
            <div
              className={clsx(
                'rounded-full p-2 flex items-center justify-center transition-all duration-300',
                value === 'thumbs-down' ? 'bg-primary-500 text-white' : 'bg-transparent text-primary-500'
              )}
            >
              <ThumbDown
                size={16}
              />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

EvaluationMode.propTypes = {
  evaluationName: PropTypes.string.isRequired,
  evaluationType: PropTypes.oneOf(['scale', 'thumbs']).isRequired,
};

export default EvaluationMode;
