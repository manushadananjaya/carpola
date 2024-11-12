import React from 'react'
import ContactUs from './contact-us'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Carpola',
  description: 'Get in touch with the team at Carpola.lk',
  keywords: [
    'contact us',
    'team',
    'Carpola',
    'Sri Lanka',
    'buy',
    'sell',
    'vehicles',
    'automobiles',
    'cars',
    'motorbikes',
    'trucks',
    'vans',
    'marketplace',
  ],
  openGraph: {
    title: 'Contact Us - Carpola',
    description: 'Get in touch with the team at Carpola.lk',
    url: 'https://carpola.lk/contact',
    images: [
      {
        url: 'https://carpola.lk/images/contact-us-og.png',
        width: 800,
        height: 600,
        alt: 'Contact Us',
      },
    ],
    type: 'website',
  },
}

function page() {
  return (
    <div>
     
      <ContactUs />
   
    </div>
  )
}

export default page
