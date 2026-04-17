import React from 'react';
import Pricing from './Pricing';
import Awards from './Awards';
import Education from './Education';
import Hero from './Hero';
import Stats from './Stats';

import Navbar from '../Navbar';
import OpenAccount from '../OpenAccount';
import Footer from '../Footer';



function Homepage() {
    return (  
        <>
       
        <Hero/>
        <Stats/>
        <Pricing/>
        <Education/>
        <OpenAccount/>
        


        </>
    );
}

export default Homepage;