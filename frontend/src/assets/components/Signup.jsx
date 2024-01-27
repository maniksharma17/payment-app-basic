import {useNavigate} from 'react-router-dom'
import { firstAtom, lastAtom, passwordAtom, tokenAtom, usernameAtom } from '../state/atoms'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useState } from 'react'
import { BASE_URL } from '../../../config'

export default function Signup() {
    const navigate = useNavigate()
    
    const [ username, setUsername ] = useRecoilState(usernameAtom)
    const [ password, setPassword ] = useRecoilState(passwordAtom)
    const [ firstName, setFirstName ] = useRecoilState(firstAtom)
    const [ lastName, setLastName ] = useRecoilState(lastAtom)
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
              Create new Account.
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Username
                </label>
                <div className="mt-0">
                  <input
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="email"
                    required
                    className="block w-full rounded-md mb-2 border-0 py-1.5 px-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  First Name
                </label>
                <div className="mt-0">
                  <input
                    onChange={(e)=>{setFirstName(e.target.value)}}
                    type="text"
                    required
                    className="block w-full rounded-md mb-2 border-0 py-1.5 px-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-200">
                  Last Name
                </label>
                <div className="mt-0">
                  <input
                    onChange={(e)=>{setLastName(e.target.value)}}
                    type="text"
                    required
                    className="block w-full rounded-md mb-2 border-0 py-1.5 px-2 text-gray-200 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-200">
                    Password
                  </label>
                  
                </div>
                <div className="mt-0">
                  <input
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                    required
                    className="block w-full rounded-md mb-2 border-0 py-1.5 px-2 text-gray-900 shadow-lg ring- ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            
                <br></br>
              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={()=>{

                   fetch(`${BASE_URL}/api/v1/user/signup`, {
                    method: "POST",
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        firstName: firstName,
                        lastName: lastName
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                   }).then(async (fetchCall) => {
                        const fetchRes = await fetchCall
                        const data = await fetchRes.json()

                    
                        if (data.error){
                            setError(data.message)
                            return
                        } else if (data.parseError) {
                            setError(data.parsedUserData.error.issues[0].message)
                            return
                        } else {
                            setToken(data.token)
                            navigate("/dashboard")
                        }    
                   }).catch((e)=>{
                    setError("Unexpected error!")
                   })
                    
                }}>
                  Sign up
                </button>
              </div>

              <div>
                {error}
              </div>
           
  
            
          </div>
        </div>
      </>
    )
  }
  