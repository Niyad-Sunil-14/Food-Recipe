import React from 'react'
import Banner from '../../components/Banner/Banner'
import Cards from '../../components/Cards/Cards'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Layout/Navbar'

function Home() {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Cards/>
        <Footer/>
    </div>
  )
}

export default Home
