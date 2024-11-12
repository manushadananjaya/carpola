import React from 'react'
import AboutUs from './about-us'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Carpola',
  description: 'Learn more about the team behind Carpola.lk',
  keywords: [
    'about us',
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
    title: 'About Us - Carpola',
    description: 'Learn more about the team behind Carpola.lk',
    url: 'https://carpola.lk/about',
    images: [
      {
        url: 'https://carpola.lk/images/about-us-og.png',
        width: 800,
        height: 600,
        alt: 'About Us',
      },
    ],
    type: 'website',
  },
}

function page() {
  return (
    <div>
      
      <AboutUs />
   
    </div>
  )
}

export default page
