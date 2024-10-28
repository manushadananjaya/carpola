import React from 'react'
import AboutUs from './about-us'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

function page() {
  return (
    <div>
        <Navbar />
      <AboutUs />
      <Footer />
    </div>
  )
}

export default page
