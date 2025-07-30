import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailersSection'

export const Home = () => {
  return (
    <div> 
      <HeroSection />
      <FeaturedSection />
      <TrailerSection />
    </div>
  )
}

export default Home
