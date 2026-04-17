import React from "react";


function SignUp() {
  return (
    <div className="container ">
      <div className="row text-center Signup-heading">
        <h1 className="Signup-heading-1">
          Open a free demat and trading account online
        </h1>
        <h3 className="Signup-heading-2">
          Start investing brokerage free and join a community of 1.6+ crore
          investors and traders
        </h3>
      </div>
      <div className="row Signup-Main">
        <div className="col-6  ">
          <img
            className="account_openImage"
            src="media/images/account_open.svg"
            alt=""
          />
        </div>
        <div className="col-6 SignUp-form">
          <h2>Signup now</h2>
          <span>Or track your existing application</span>

          <form action="/signup">
            <div class="form-group">
              <label for="phone"></label>
              <input
                type="tel"
                class="form-control"
                id="phone"
                name="phone"
                pattern="[0-9]{10}"
                placeholder="Enter your mobile Number"
              />
            </div>
            <button type="submit" class="btn btn-primary mt-5">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
