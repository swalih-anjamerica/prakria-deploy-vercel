import React from 'react'

function Loader({ height }) {
  return (
    <div className='loader-container' style={{height}}>
      <div className='loader'></div>
    </div>
  )
}

export default Loader