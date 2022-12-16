import { useRouter } from 'next/router';
import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import rivisionService from '../../../services/rivision';
import { Modal } from '../../common/Modal'

function RevisionInputModal({ showModal, setShowModal, position, setPosition, setMarkers, setUpdatedDate }) {
    const [inputItem, setInputItem] = useState("");
    const { user } = useAuth();
    const router=useRouter();
    const { revisionId } = router.query;
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!position.x || !position.y) return;
            setMarkers(prev => {
                return [...prev, { x: position?.x, y: position.y, input: inputItem }]
            })
            await rivisionService.addCommentInRivision(revisionId,user?._id,inputItem, position.x, position.y);
            setUpdatedDate(Date.now());
            setInputItem("");
            setPosition({});
            setShowModal(false);
        } catch (e) {
        }
    }
    return (
        <Modal
            title="Input your comment"
            showModal={showModal}
            setShowModal={setShowModal}
            className="w-fit max-w-[100vw]"
        >
            <form onSubmit={handleSubmit} className="w-[30rem]">
                {/* <input type="text" onChange={e=>{
                    setInputItem(e.target.value);
                }} value={inputItem} className="px-5 py-2 mb-5" placeholder='Enter your comment'/> */}
                <textarea rows={2} cols={40} onChange={e => {
                    setInputItem(e.target.value);
                }} value={inputItem} className="px-5 py-2 mb-5" placeholder='text here..' />
                <button className='w-20 self-center font-medium flex flex-col text-primary-black rounded-md bg-light-yellow  justify-center items-center transition-colors duration-150 hover:bg-secondry-yellow p-2  cursor-pointer  z-10 border-0'>Ok</button>
            </form>
        </Modal>
    )
}

export default RevisionInputModal