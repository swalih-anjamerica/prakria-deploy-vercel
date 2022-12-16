import React from 'react'
import { useAuth } from '../../../hooks/useAuth';

function RevisionMarks({ showMarks, fileExt, savedComments = [], localComments = [], vidCurrTime, handleRemoveComment, setLocalComments }) {
    const { user, role } = useAuth();
    const handleRemoveLocalComments = (comment_id) => {
        let comments = localComments.filter(comment => comment._id !== comment_id);
        setLocalComments(comments);
    }
    if (!showMarks) return null;
    // image markers
    if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png" || fileExt == "gif" || fileExt == "svg" || fileExt == "webp") {
        return (
            <>
                {
                    savedComments?.map((mark, index) => {
                        let commentUser = mark.user;
                        let pointerClassName;
                        if (mark.position_y <= 7) {
                            pointerClassName = commentUser.role == "project_manager" ? "marker-class-top-yellow" : "marker-class-top";
                        } else {
                            pointerClassName = commentUser.role == "project_manager" ? "marker-class-yellow" : "marker-class";
                        }

                        if (commentUser.role === "project_manager" && (role === "client_admin" || role === "client_member")) return;

                        return (
                            <div key={index} style={{ left: `${mark.position_x}%`, top: `${mark.position_y}%` }} className={`${pointerClassName} absolute ${commentUser.role == "project_manager" ? "bg-[#FFE147]" : "bg-white"} border-[1px] border-black px-2 text-sm py-2 lg:pl-2 lg:pr-5 lg:py-3 w-full  max-w-[200px] comment-box`}>
                                <div className="relative max-w-[200px] ">
                                    <p className="text-[#0B0B0B] break-words">
                                        {
                                            mark.comment_text
                                        }
                                    </p>
                                </div>
                                {
                                    mark.comment_user_id == user?._id &&
                                    <span className="absolute top-[-10px] right-[-10px] bg-red px-2 py-1 rounded-[50%] text-white font-bold cursor-pointer" onClick={() => {
                                        handleRemoveComment(mark._id);
                                    }}>
                                        X
                                    </span>
                                }
                            </div>
                        )
                    })
                }
                {
                    localComments?.map((mark, index) => {
                        let commentUser = user;
                        let pointerClassName;
                        if (mark.position_y <= 7) {
                            pointerClassName = commentUser.role == "project_manager" ? "marker-class-top-yellow" : "marker-class-top";
                        } else {
                            pointerClassName = commentUser.role == "project_manager" ? "marker-class-yellow" : "marker-class";
                        }
                        return (
                            <div key={index} style={{ left: `${mark.position_x}%`, top: `${mark.position_y}%` }} className={`${pointerClassName} absolute ${commentUser.role == "project_manager" ? "bg-[#FFE147]" : "bg-white"} border-[1px] border-black px-2 text-sm py-2 lg:pl-2 lg:pr-5 lg:py-3 w-full  max-w-[200px] comment-box`}>
                                <div className="relative max-w-[200px] ">
                                    <p className="text-[#0B0B0B] break-words">
                                        {
                                            mark.comment_text
                                        }
                                    </p>
                                </div>
                                {
                                    mark.comment_user_id == user?._id &&
                                    <span className="absolute top-[-10px] right-[-10px] bg-red px-2 py-1 rounded-[50%] text-white font-bold cursor-pointer" onClick={() => {
                                        handleRemoveLocalComments(mark._id);
                                    }}>
                                        X
                                    </span>
                                }
                            </div>
                        )
                    })
                }
            </>
        )
    }
    // video markers
    else {
        return (
            <>
                {
                    savedComments?.map((mark, index) => {
                        if (parseInt(mark.video_mark_time) === vidCurrTime) {
                            return (
                                <div onClick={() => {
                                    handleRemoveComment(mark._id);
                                }} key={index} style={{ left: `${mark.position_x}%`, top: `${mark.position_y}%` }} className={`${mark.position_y <= 7 ? "marker-class-top" : "marker-class"} absolute bg-white border-[1px] border-black px-2 text-sm py-2 lg:pl-2 lg:pr-5 lg:py-3 w-full  max-w-[200px] `}>
                                    <div className="relative max-w-[200px] ">
                                        <p className="text-[#0B0B0B] break-words">
                                            {
                                                mark.comment_text
                                            }
                                        </p>
                                    </div>
                                    {
                                        mark.comment_user_id == user?._id &&
                                        <span className="absolute top-[-10px] right-[-10px] bg-red px-2 py-1 rounded-[50%] text-white font-bold cursor-pointer">
                                            X
                                        </span>
                                    }
                                </div>
                            )
                        }
                        return null;
                    })
                }
                {
                    localComments?.map((mark, index) => {
                        if (parseInt(mark.video_mark_time) === vidCurrTime) {
                            return (
                                <div onClick={() => {
                                    handleRemoveLocalComments(mark._id);
                                }} key={index} style={{ left: `${mark.position_x}%`, top: `${mark.position_y}%` }} className={`${mark.position_y <= 7 ? "marker-class-top" : "marker-class"} absolute bg-white border-[1px] border-black px-2 text-sm py-2 lg:pl-2 lg:pr-5 lg:py-3 w-full  max-w-[200px] `}>
                                    <div className="relative max-w-[200px] ">
                                        <p className="text-[#0B0B0B] break-words">
                                            {
                                                mark.comment_text
                                            }
                                        </p>
                                    </div>
                                    {
                                        mark.comment_user_id == user?._id &&
                                        <span className="absolute top-[-10px] right-[-10px] bg-red px-2 py-1 rounded-[50%] text-white font-bold cursor-pointer">
                                            X
                                        </span>
                                    }
                                </div>
                            )
                        }
                        return null;
                    })
                }
            </>
        )
    }
}

export default RevisionMarks