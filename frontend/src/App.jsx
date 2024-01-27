import { Suspense } from "react"
import Dashboard from "./assets/components/Dashboard"
import Signin from "./assets/components/Signin"
import Signup from "./assets/components/Signup"

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RecoilRoot } from "recoil"


function App() {

  return (
    
      <BrowserRouter>
      <RecoilRoot>
        <Routes>
          
          <Route path="/" element={<Suspense fallback={"Loading..."}><Signin></Signin></Suspense>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/dashboard" element={<Suspense fallback={"Loading..."}><Dashboard></Dashboard></Suspense>}></Route>
         
        </Routes>
        </RecoilRoot>
    </BrowserRouter>
   
    
  )
}

export default App
