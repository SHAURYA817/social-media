import { useState } from "react"
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [SignUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const handleSignUp = (e) => {
    e.preventDefault()
  }

  return  <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="coffee">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

       {/* signup form - left side */}

       <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
        {/* logo */}
       <div className="mb-4 flex items-center justify-start gap-2">
        <ShipWheelIcon className="size-9 text-primary" />
      <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
        Insta
      </span>

      </div>

      <div className = "w-full">
        <form onSubmit={handleSignUp}>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Create an account</h2>
              <p className = "text-sm opacity-70">
                join insta and start your learning adventure!
              </p>
            </div>

            <div className = "space-y-3">
              {/* full name */}
              <div className ="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  value={SignUpData.fullName}
                  onChange={(e) => setSignUpData({...SignUpData, fullName: e.target.value})}
                  required
                />
              </div>
              {/* email */}
               <div className ="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={SignUpData.email}
                  onChange={(e) => setSignUpData({...SignUpData, email: e.target.value})}
                  required
                />
              </div>
              {/* password */}
               <div className ="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  value={SignUpData.password}
                  onChange={(e) => setSignUpData({...SignUpData, password: e.target.value})}
                  required
                />
                <p className = "text-xs opacity-70 mt-1">
                  Password must be 6 characters long
                </p>
              </div>
              {/* terms and conditions */}
              <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
              </div>
            </div>
          {/* submit button */}
          <button className ="btn btn-primary w-full" type="submit">
             Create Account
          </button>
            <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
            </div>
          </div>
        </form>
      </div>

      </div>

      {/* image - right side */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/videocall.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
      </div>


    </div>
  </div>

}
export default SignUpPage