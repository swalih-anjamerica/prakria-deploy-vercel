
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { dateFormatter } from '../../../helpers/dateHelpers'
import validator from '../../../helpers/formValidator'
import LoaderButton from "../../common/ButtonLoader";

function

  CreatePlan({
    title,
    setTitle,
    setDescription,
    description,
    features,
    setFeatures,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    storage,
    setStorage,
    resources,
    setResources,
    isCreative,
    setIsCreative,
    durationList,
    skillList,
    createPlanHandler,
    titleMaxLen,
    amountMaxLim,
    countMaxLim,
    descMaxLen,
    featureMaxLim,
    monthlyAmount, setMonthlyAmount,
    quaterlyAmount, setQuaterlyAmount,
    yearlyAmount, setYearlyAmount,
    editStartDate,
    editEndDate,
    monthStripePriceId,
    quarterlyStripePriceId,
    yearlyStripePriceId,
    planUpdating
  }) {


  const [featureInput, setFeatureInput] = useState("")
  const [resourceCount, setResourceCount] = useState()
  const [currentSkillId, setCurrentSkillId] = useState("")
  const [currentSkillname, setCurrentSkillname] = useState("")



  //error states 
  const [titleError, setTitleError] = useState('')
  const [monthlyError, setMonthlyError] = useState('')
  const [yearlyError, setYearlyError] = useState('')
  const [quaterlyError, setQuaterlyError] = useState('')
  const [fromDateError, setFromDateError] = useState("")
  const [toDateError, setToDateError] = useState("")
  const [countError, setCountError] = useState("")
  const [descError, setDescError] = useState("")
  const [featureError, setFeatureError] = useState("")

  const addFeatureHandler = async() => {
    if (!featureInput) return setFeatureError("cannot be empty")
    if (features.length > 20) return;
    setFeatures((prev) => [...prev, (featureInput.trim())])
    setFeatureInput("")
  }

  const addResourceHandler = async(e) => {
    const id = currentSkillId
    const selectRes = {
      name: currentSkillname,
      skill_id: id,
      count: resourceCount
    }
    let resArr = [...resources]
    let objIndex = resources.findIndex((obj => obj.skill_id === id));
    if (objIndex !== -1) {
      resArr[objIndex] = {
        name: currentSkillname,
        skill_id: id,
        count: Number(resArr[objIndex].count) + Number(resourceCount)

      }
    } else {
      resArr.push(selectRes)
    }
    setResources(resArr)
  }
  
  const planSubmitHandler = async() => {
    let duration = [
      { duration_name: "quarterly", amount: Number(quaterlyAmount), stripe_price_id: quarterlyStripePriceId },
      { duration_name: "monthly", amount: Number(monthlyAmount), stripe_price_id: monthStripePriceId },
      { duration_name: "yearly", amount: Number(yearlyAmount), stripe_price_id: yearlyStripePriceId },
    ]
    duration = duration.filter((value) => value != null)

    if (duration.length < 3) {
      toast.dismiss()
      return toast.error("Select atleast 3 Duration")
    }
    createPlanHandler(duration)
  }

  return (
    <>

      <div className="bg-primary-white w-full flex-1 px-2 xl:px-4">

        <div className="px-5 py-10 bg-secondry-gray grid grid-cols-12 gap-4">
          <div className="col-span-6">
            {/* title */}
            <div>
              <div className="flex-col w-full">
                <h1 className='text-add-resource mt-10 '>Title</h1>
                <input className="form-input" id="title" type="text"
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length > titleMaxLen) return setTitleError("maximum limit")
                    setTitleError("")
                    setTitle(e.target.value)
                    validator.nameInputChangeHandler(e.target.value, setTitleError, titleMaxLen)
                  }
                  }
                  onBlur={(e) => {
                    validator.nameInputBlurHandler(e.target.value, setTitleError, titleMaxLen);
                  }}
                />
              </div>
              <div className='flex justify-between'>
                <p className='text-sm ps-1 pt-1 text-red' >{titleError}</p>
                <p className='text-xs p-1 mr-1 text-secondry-text'> {titleMaxLen - title.length} </p>
              </div>
            </div>
            {/* plans */}
            <div className='w-full mt-0'>
              <h1 className='text-add-resource mb-5'>Price Details</h1>
            </div>
            {/* <small className='text-sm text-secondry-text font-regular'>  (Pick any 3 )</small> */}
            <div className='grid grid-cols-2 gap-2 mb-3'>
              {/* Monthly */}
              <div className="flex-col  w-full " >
                <div className='flex content-center '>
                  <label className="form-label" htmlFor={"monthly"}>
                    Monthly
                  </label>
                  {/* <input type={"checkbox"} id='monthly' checked={durationCheck[2]} className='p-[3px] accent-primary-blue mx-[5px] h-[22px] w-[16px] hover:cursor-pointer'
                    onChange={(e) => { durationCheckHandler(e.currentTarget.checked, 2) }}
                  /> */}
                </div>
                <div className="min-h-[46px]">
                  <input value={monthlyAmount} className="form-input transition-all" type="number"
                    onChange={(e) => {

                      if (e.target.value > amountMaxLim) return setMonthlyError("Maximum Limit")
                      setMonthlyError("")
                      setMonthlyAmount(e.target.value)
                      validator.priceInputChangeHandler(e.target.value, setMonthlyError)

                    }}
                    onBlur={(e) => {
                      validator.priceInputBlurHandler(e.target.value, setMonthlyError)

                    }}

                    placeholder='amount'
                  />
                </div>
                <div className='flex justify-between'>
                  <p className='text-xs  pt-1 text-red' >{monthlyError}</p>
                  {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
                </div>
              </div>
              {/* Quarterly */}
              <div className="flex-col  w-full " >
                <div className='flex content-center '>
                  <label className="form-label" htmlFor={"quaterly"}>
                    Quaterly
                  </label>
                </div>
                <div className="min-h-[46px]">
                  <input className="form-input transition-all" type="number"
                    value={quaterlyAmount}
                    placeholder='amount'
                    onChange={(e) => {
                      if (e.target.value > amountMaxLim) return setQuaterlyError("Maximum Limit")
                      setQuaterlyError("")
                      setQuaterlyAmount(e.target.value)
                      validator.priceInputChangeHandler(e.target.value, setQuaterlyError)
                    }}
                    onBlur={(e) => {
                      validator.priceInputBlurHandler(e.target.value, setQuaterlyError)
                    }}
                  />
                </div>
                <div className='flex justify-between'>
                  <p className='text-xs  pt-1 text-red' >{quaterlyError}</p>
                  {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
                </div>
              </div>
              {/* Yearly */}
              <div className="flex-col  w-full " >
                <div className='flex content-center '>
                  <label className="form-label" htmlFor={"yealy"}>
                    Yearly
                  </label>
                </div>
                <div className="min-h-[46px]">
                  <input className="form-input transition-all" value={yearlyAmount} type="number"
                    placeholder='amount'
                    onChange={(e) => {
                      if (e.target.value > amountMaxLim) return setYearlyError("Maximum Limit is " + amountMaxLim)
                      setYearlyError("")
                      setYearlyAmount(e.target.value)
                      validator.priceInputChangeHandler(e.target.value, setYearlyError)
                    }}
                    onBlur={(e) => {
                      validator.priceInputBlurHandler(e.target.value, setYearlyError)
                    }}
                  />
                </div>
                <div className='flex justify-between'>
                  <p className='text-xs  pt-1 text-red' >{yearlyError}</p>
                  {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
                </div>
              </div>
            </div>
            <h1 className='text-add-resource mt-10'>Period</h1>
            <div className='grid grid-cols-2 gap-2 mb-3'>
              <div>
                <label className='form-label' htmlFor="from_date">From {editStartDate && <span className='font-semibold'>( {dateFormatter(new Date(editStartDate), true)} )</span>} </label>
                <input type="date" value={startDate} className='form-input' min={new Date().toISOString().split("T")[0]} id="from_date" name="from_date"
                  onChange={(e) => {
                    // if (dateFormatter(new Date(e.target.value)) < dateFormatter(new Date())) {
                    //   return setFromDateError("Invalid Start Date")
                    // }
                    setFromDateError("")
                    setStartDate(e.target.value)
                  }}
                />
                <div className='flex justify-between'>
                  <p className='text-xs  pt-1 text-red' >{fromDateError}</p>
                  {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
                </div>
              </div>
              <div>
                <label className='form-label' htmlFor="from_date">To {editEndDate && <span className='font-semibold'>( {dateFormatter(new Date(editEndDate), true)} )</span>}  </label>
                <input type="date" value={endDate} className='form-input' id="to_date" min={
                  startDate ? new Date(startDate).toISOString().split("T")[0]
                    :
                    new Date().toISOString().split("T")[0]
                } name="to_date"
                  onChange={(e) => {
                    // if (dateFormatter(new Date(e.target.value)) < dateFormatter(new Date())) {
                    //   return setFromDateError("Invalid End Date")
                    // }
                    setFromDateError("")
                    setEndDate(e.target.value)
                  }}
                />
              </div>
              <div className='flex justify-between'>
                <p className='text-xs  pt-1 text-red' >{toDateError}</p>
                {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
              </div>
            </div>
          </div>

          {/* plan */}
          <div className="col-span-6 border-l-2 pl-4 2xl:pl-8 mr-2 border-x-secondry-text">
            <div className='mb-3 '>
              <h1 className='text-add-resource'>Resources</h1>
              <label className='form-label' htmlFor="cars">Choose resources</label>
              <div className='flex justify-evenly items-center'>
                <div className='w-full '>
                  <select className='px-1 xl:px-3 py-1 h-10 self-stretch w-full rounded-sm' id={currentSkillId} value={currentSkillId} name="resources"
                    onChange={(e) => {
                      setCurrentSkillId(e.target.value)
                      const currentSkill = skillList.find((value) => {
                        return value._id === e.target.value
                      })
                      setCurrentSkillname(currentSkill.skill_name)
                    }}
                  >
                    <option value="" disabled>Select Skill</option>
                    {skillList.map((value, i) => {
                      return (
                        <option id={value._id} value={value._id} key={value._id}>{value.skill_name}</option>
                      )
                    })}

                  </select>
                </div>
                <div className="flex-col w-fit justify-center items-center mx-1 xl:mx-5"><span>X</span></div>
                <div className='w-fit flex justify-between'>
                  <div className="flex-col">
                    {/* <label className="form-label" htmlFor="monthly-amount">
                      count : {currentSkillname}
                    </label> */}
                    <div className='flex-col'>
                      <div className='flex h-10 w-32'>
                        <input className="form-input" id="count" type="number" min={0}
                          required={true}
                          value={resourceCount}
                          onChange={(e) => {
                            setCountError("");
                            if (e.target.value < 0) return;
                            if (e.target.value < 1 || e.target.value > 10) return;
                            if (isNaN(e.target.value)) return;
                            setResourceCount(e.target.value)
                          }}
                        />
                        <span id={currentSkillId} className="items-center self-center p-3 hover:bg-secondry-yellow bg-primary-yellow rounded-r leading-tight hover:cursor-pointer h-10  " onClick={addResourceHandler}>
                          Add
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <p className='text-xs  pt-1 text-red' >{countError}</p>
                        {/* <p className='text-xs  text-secondry-text'> $ {amountMaxLim} </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap w-fit mx-1 my-3'>
                {
                  resources && resources?.map((res, index) => {
                    return (
                      <div key={index} className='inline-flex mx-2 my-1 p-1 rounded-lg bg-primary-yellow '>
                        <span className='text-secondry-text text-xs font-medium font-sans '>{res.name} : {res.count}</span>
                        <span className='t bg-red ml-2 px-1 hover:cursor-pointer hover:bg-red-dark text-primary-white rounded-xl text-xs font-medium font-sans '
                          onClick={() => {
                            setResources(resources.filter((value, i) => {
                              return i !== index

                            }))
                          }}
                        >x</span>
                      </div>
                    )

                  })
                }

              </div>
              <div className='flex justify-around my-2 2xl:my-5'>
                <div className='flex content-start '>
                  <label className="form-label" htmlFor="quarterly-amount">
                    Creative Director
                  </label>
                  <input type={"checkbox"} checked={isCreative} className='p-[3px] accent-primary-blue mx-[5px] h-[22px] w-[16px] hover:cursor-pointer'
                    onChange={(e) => { setIsCreative(!isCreative) }}
                  />
                </div>
                <div className='flex content-start '>
                  <label className="form-label" htmlFor="quarterly-amount">
                    Project Manager
                  </label>
                  <input type={"checkbox"} defaultChecked={true} disabled={true} className='p-[3px] accent-primary-blue mx-[5px] h-[22px] w-[16px] hover:cursor-pointer'
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex-col w-full ">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea className="form-input" rows={3} id="description" type="text"
                  value={description}
                  onChange={(e) => {
                    // if (e.target.value.length <= descMaxLen) setDescError("");
                    // if (e.target.value.length > descMaxLen) return setDescError("Limit Exceed")
                    setDescription(e.target.value)
                  }}
                />
              </div>
              <div className='flex justify-between'>
                <p className='text-xs  pt-1 text-red' >{descError}</p>
                <p className='text-xs  text-secondry-text'>  {descMaxLen - description.length} </p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex-col  w-full ">
                <label className="form-label" htmlFor="features">
                  Features
                </label>
                <div className='flex'>
                  <input className=" form-input " id="features" type="text"
                    value={featureInput}
                    onChange={(e) => {
                      if (e.target.value.length > featureMaxLim) return setFeatureError("Limit Exceed")
                      setFeatureInput(e.target.value)
                    }}
                  />
                  <span className="items-center self-center p-3 hover:bg-secondry-yellow bg-primary-yellow rounded-r leading-tight hover:cursor-pointer" onClick={addFeatureHandler}>
                    Add
                  </span>
                </div>
                <div className='flex justify-between m-1 pt-1'>
                  <p className='text-xs  pt-1 text-red' >{featureError}</p>
                  <p className='text-xs  text-secondry-text'>  {featureMaxLim - featureInput.length} </p>
                </div>
              </div>

              <div className='flex flex-wrap w-fit mx-1 my-2'>
                {
                  features && features?.map((feature, index) => {
                    return (
                      <div key={index} className='inline-flex mx-2 my-1 p-1 rounded-lg bg-primary-blue-light '>
                        <span className='text-secondry-text text-xs font-medium font-sans '>{feature}</span>
                        <span className='t bg-red ml-2 px-1 hover:cursor-pointer hover:bg-red-dark text-primary-white rounded-xl text-xs font-medium font-sans '
                          onClick={() => {
                            setFeatures(features.filter((value, i) => {
                              return i !== index
                            }))
                          }}
                        >x</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className="col-start-4 2xl:col-start-9 w-64">
            {
              planUpdating ?
                <button className="yellow-lg-action-button" id='create-plan-btn' disabled>
                  <LoaderButton />
                </button>
                :
                <button className="yellow-lg-action-button" id='create-plan-btn' onClick={() => { planSubmitHandler() }}>Save</button>
            }
          </div>
        </div>

      </div>
    </>
  )
}

export default CreatePlan





