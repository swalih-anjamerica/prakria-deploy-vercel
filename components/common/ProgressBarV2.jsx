import React from 'react'

function ProgressBarV2({ progress = 0, progressByNumber = false, message="loading... " }) {

    // if (progress <= 0 || progress>=100) {
    //     return null;
    // }
    if (isNaN(progress)) {
        progress = 100;
    }

    if (progressByNumber && (progress < 1 || progress >= 100)) {
        return null;
    }

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">

                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full h-[90px]">
                        <div className="bg-white px-4 pt-4 pb-4 sm:p-6 sm:pb-4">
                            <h1 className="font-semibold">{message}<span>({progress}%)</span></h1>
                            <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
                                <div className="w-full h-full bg-gray-200 absolute"></div>
                                <div id="bar" className={`transition-all ease-out duration-1000 h-full bg-green-500 relative`} style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProgressBarV2