import React from 'react'
import Intro from './components/Intro'
import Services from './components/Services'
import About from './components/About'
import Portfolio from './components/Porfolio'
import Carousel from './components/CarouselFoto'
import ContactSection from './components/ContactSection'
import VideoCarousel from './components/CarouselVideo'

function Principal() {
    return (
        <>
            <Intro></Intro>
            <About></About>
            <Services></Services>
            <Portfolio></Portfolio>
            <Carousel></Carousel>
            <VideoCarousel></VideoCarousel>
            <ContactSection></ContactSection>
        </>

    )
}

export default Principal