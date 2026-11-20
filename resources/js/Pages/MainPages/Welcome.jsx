import About from '@/HomeComponents/About'
import Hero from '@/HomeComponents/Hero'
import React from 'react'
import GuestLayout from '@/Layouts/GuestLayout'

const Welcome = () => {
  return (
    <div>
      <Hero/>
      <About />
    </div>
  )
}


 Welcome.layout = (page) => <GuestLayout>{page}</GuestLayout>;

export default Welcome
