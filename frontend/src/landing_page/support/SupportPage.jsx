import React from 'react';
import CreatetTicket from './CreateTicket';
import Hero from './Hero';

import Navbar from '../Navbar';
import Footer from '../Footer';
import OpenAccount from '../OpenAccount';


function SupportPage() {
    return (  
        <>
            <CreatetTicket/>
            <Hero/> 
            <OpenAccount/>
        </>
    );
}

export default SupportPage;