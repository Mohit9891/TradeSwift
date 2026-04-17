import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row text-center" >
        <img src="media/images/homeHero.png" alt="Hero Image" className="mb-5"  style={{width:"67%", margin:"0 auto"}}/>
        <h1 className="mt-5  " style={{fontSize :"3rem"}}>Invest in everything</h1>
        <p style={{fontSize :"1.3rem"}}>
          Online platform to invest in stocks, derivatives, mutual funds, ETFs,
          bonds, and more.
        </p>
        <button  className = "p-2 mb-5 btn btn-primary fs-5"  style={{width:"20%", margin: " 0 auto", }}> Sign up for free</button>
      </div>
    </div>
  );
}

export default Hero;
