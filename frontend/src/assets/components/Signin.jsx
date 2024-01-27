import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { usernameAtom, passwordAtom, tokenAtom, firstAtom } from '../state/atoms'

export default function Signin() {
    const navigate = useNavigate()

    const [ username, setUsername ] = useRecoilState(usernameAtom)
    const [ password, setPassword ] = useRecoilState(passwordAtom)
    const setFirstName = useSetRecoilState(firstAtom)
    const setToken = useSetRecoilState(tokenAtom)
    const [ error, setError ] = useState("")

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=400"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className='mb-2'>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">
                  Username
                </label>
                <div className="">
                  <input
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-200">
                    Password
                  </label>
                  
                </div>
                <div className="">
                  <input
                  onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            
            <br></br>
              <div>
                <button
                 
                  className="flex w-full shadow-lg justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={()=>{
                        fetch("http://localhost:3000/api/v1/user/signin", {
                            method: "POST",
                            body: JSON.stringify({
                                username: username, password: password
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        .then(async (fetchCall)=>{
                            const fetchRes = await fetchCall
                            const data = await fetchRes.json()

                            if (data.error){
                                setError(data.message)
                                return
                            } else {
                                localStorage.setItem("userInfo", JSON.stringify.data)
                                setToken(data.token)
                                setFirstName(data.firstName)
                                navigate("/dashboard")
                            }
                            
                        })
                    }}>
                  Sign in
                </button>

                <div>
                    {error}
                </div>
              </div>
            
  
            <p className="mt-10 text-center text-sm text-gray-200">
              Not a member?{' '}
              <a href="" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-500" onClick={()=>{
                navigate("/signup")
              }}>
                Create account.
              </a>
            </p>
          </div>
        </div>
      </>
    )
  }
  