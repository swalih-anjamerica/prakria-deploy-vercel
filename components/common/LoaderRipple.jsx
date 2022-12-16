import { useState } from 'react';

export const LoaderRipple = ({
    show = false,
}) => {

    return (
        <div
            className={`fixed z-50 inset-0 overflow-y-auto ${!show && 'hidden'}`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-primary-gray bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                />
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true">
                    &#8203;
                </span>
                <div className="relative inline-block align-bottom text-left overflow-hidden  transform transition-all  sm:align-middle ">
                    <div className="lds-ripple">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
