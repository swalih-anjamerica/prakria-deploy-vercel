export const ProgressBar = ({
    progress = 0,
}) => {
    let show = false;
    show = (progress == 0 || progress >= 320) ? false : true;
   
    return (
        <div
            className={`fixed z-50 inset-0 overflow-y-auto ${show == false ? 'hidden' : ""}`}
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
                <div className="h-14 justify-between relative inline-block align-bottom text-left overflow-hidden  transform transition-all  sm:align-middle bg-white p-1 rounded-xl   ">
                    <div className=" h-2 relative w-80 bg-purple-200 rounded-xl mt-2">
                        <div className="absolute bg-purple-700 left-0 h-2 rounded-xl" style={{ width: progress }}></div>
                    </div> <p className="m-2" > uploading your files, please wait ...</p>
                </div>
            </div>
        </div>
    );
};

export const ProgressBarDownload = ({ progress = 0 }) => {
    let show = false;
    show = (progress == 0 || progress >= 320) ? false : true;
    let value = progress / 320 * 100
    return (
        <div className={`flex justify-center ${show == false ? 'hidden' : ""}`}>
            <div className="h-20 w-full relative inline-block align-bottom text-left overflow-hidden  transform transition-all sm:align-middle bg-white">
                <div className=" h-2 relative w-full bg-purple-200">
                    <div className={`absolute bg-yellow-700 left-0  h-2 transition-transform rounded-r-lg`} style={{ width: `${value}%` }}></div>
                </div>
            </div>
        </div >
    );
};



