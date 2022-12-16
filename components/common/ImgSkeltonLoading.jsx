import React from "react"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

function ImgSkeltonLoading({ height = 700, isLoading }) {

    if (!isLoading) return null;

    return (
        // <SkeletonTheme baseColor="#e6dfdf" highlightColor="#c4c4c4">
        <div className="absolute w-full h-full -top-1">
            <Skeleton style={{width:"100%", height:"100%", borderRadius:"0"}} />
        </div>
        // </SkeletonTheme>
    )
}

export default ImgSkeltonLoading