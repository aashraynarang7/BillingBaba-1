import React from 'react'
import WorkWithUs from './component/WorkWithUs'
import WhyWorkWithUs from './component/WhyWorkWithUs'
import Perks from './component/Perks'
import PictureYourself from './component/PictureYourself'
import GreatWorkplaces from './component/GreatWorkplaces'
import JobSearch from './component/JobSearch'

const CareerPage = () => {
  return (
    <div className='py-10'>
      <WorkWithUs />
      <Perks />
      <WhyWorkWithUs />
      <GreatWorkplaces />
      <PictureYourself />
      <JobSearch />
    </div>
  )
}

export default CareerPage
