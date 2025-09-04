import React from 'react'
import Intro from './components/Intro'
import Services from './components/Services'
import About from './components/About'
import Portfolio from './components/Porfolio'
import Carousel from './components/CarouselFoto'
import ContactSection from './components/ContactSection'
import VideoCarousel from './components/CarouselVideo'
import { useAuth } from '../store/AuthContext'

function Principal() {

    const { isAdmin } = useAuth();

    return (
        <>
            <Intro></Intro>
            <About></About>
            <Services></Services>
            <Portfolio></Portfolio>
            <Carousel showDelete={false} isAdmin={isAdmin}></Carousel>
            <VideoCarousel showDelete={false} isAdmin={isAdmin}></VideoCarousel>
            <ContactSection></ContactSection>
        </>

    )
}

export default Principal