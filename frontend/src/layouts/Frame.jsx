import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Frame = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className=" h-svh w-2/3 relative flex flex-col border-primary-500 border-2 rounded-xl items-center justify-center bg-bg-100">
                <Header />
                <div className='w-full grow'>
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Frame;
