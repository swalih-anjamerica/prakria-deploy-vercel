const ConfirmAlert = ({
    content,
    handleConfirm,
    handleCancel,
}) => {
    return (
        <div
            className={`fixed z-10 inset-0 overflow-y-auto modal-animation`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true">
            <div className="fixed flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-opacity-25 bg-black"
                    aria-hidden="true"
                />
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true">
                    &#8203;
                </span>

                <div className="fixed top-[40%] left-[50%] inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" style={{ transform: "translate(-50%, -50%)" }}>
                    <div className="p-10 bg-secondry-gray w-full  my-auto gap-4">

                        <p className="text-xl">{content}</p>
                        <div className="col-span-12  mt-10 flex justify-between">
                            <button
                                onClick={handleCancel}
                                className="bg-primary-gray px-4 py-1 rounded-xl uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="bg-[#3B85F5] hover:bg-blue-700 text-white px-4 py-1 rounded-xl uppercase"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ConfirmAlert;