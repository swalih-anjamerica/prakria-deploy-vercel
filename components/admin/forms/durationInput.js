import React, { useState } from 'react'
import toast from 'react-hot-toast'

function DurationInput({ duration, index, addDurationHandler, durationCheck,
  setDurationCheck }) {

  const durationCheckHandler = (checked, position) => {

    let limit = 3
    let count = 0
    let length = durationCheck.length
    if (checked) {
      for (let i = 0; i < length; i++) {

        if (durationCheck[i]) {
          count++
        }
      }

      if (count >= limit) return
    }
    const updatedCheckedState = durationCheck.map((item, index) =>
      index === position ? !item : item
    );

    setDurationCheck(updatedCheckedState);

    if (!checked) {
      setDuarationAmount("");
    }

  }

  const [durationAmount, setDuarationAmount] = useState(null)

  const durationId = duration._id
  return (
    <div className="flex-col  w-full " key={durationId}>
      <div className='flex content-center '>

        <label className="form-label" htmlFor={durationId}>
          {duration.duration_name}
        </label>
        <input type={"checkbox"} checked={durationCheck[index]} className='p-[3px] accent-primary-blue mx-[5px] h-[22px] w-[16px] hover:cursor-pointer'
          onChange={(e) => { durationCheckHandler(e.currentTarget.checked, index) }}

        />
      </div>
      {durationCheck[index] && <input disabled={!durationCheck[index]} className="form-input transition-all" value={durationAmount} id={durationId} type="text"
        onChange={(e) => {

          if (isNaN(e.target.value)) {
            toast.dismiss()
            return toast.error("Enter a Valid Number")
          }
          setDuarationAmount(e.target.value)
        }}
        onBlur={(e) => { addDurationHandler(durationId, durationAmount) }}
      />}
    </div>
  )
}

export default DurationInput