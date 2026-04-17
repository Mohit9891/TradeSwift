import React from "react";

function Team() {
  return (
    <div className="container ">
      <div className="row first mb-5 p-5">
        <div className="col-5 nitin ">
          <img src="media/images/nithinKamath.jpg" className="image-nitin" alt="" />
          <h5>
            Nithin Kamath
          </h5>
        </div>
        <div className="col-7 bio">
          <h1 className="mb-5">People</h1>
          <p>
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            Zerodha has changed the landscape of the Indian broking industry.
          </p>
          <p>He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).</p>
          <p>Playing basketball is his zen.</p>
          <p>Connect on Homepage / TradingQnA / Twitter</p>
        </div>
      </div>

      <div className="row mt-5 Team-1">
        <div className="col-4"><img className="Nikhil"src="media/images/Nikhil.jpg" alt="" /></div>
        <div className="col-4"><img className="Kailash"src="media/images/Kailash.jpg" alt="" /></div>
        <div className="col-4"><img className="Venu" src="media/images/Venu.jpg" alt="" /></div>
      </div>

         <div className="row mt-5 Team-2">
        <div className="col-4"><img className="Nikhil"src="media/images/Hanan.jpg" alt="" /></div>
        <div className="col-4"><img className="Kailash"src="media/images/Seema.jpg" alt="" /></div>
        <div className="col-4"><img className="Venu" src="media/images/karthik.jpg" alt="" /></div>
      </div>
         <div className="row mt-5 Team-2">
        <div className="col-4"><img className="Nikhil"src="media/images/Austin.jpg" alt="" /></div>
    
      </div>
    </div>
  );
}

export default Team;
