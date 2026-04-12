import React, { useEffect } from 'react'
import HeroSection from '../components/landing/HeroSection'
import FeaturedBooks from '../components/landing/FeaturedBooks'
import Testimonials from '../components/landing/Testimonials'
import NewsletterSection from '../components/landing/NewsletterSection'
import AboutSection from '../components/landing/AboutSection'

const Landing: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <>
      <HeroSection />
      <FeaturedBooks />
      <Testimonials />
      <NewsletterSection />
      <AboutSection />
    </>
  )
}

export default Landing
