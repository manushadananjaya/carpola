import React from 'react'
import ContactUs from './contact-us'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

function page() {
  return (
    <div>
        <Navbar />
      <ContactUs />
      <Footer />
    </div>
  )
}

export default page
