import { Suspense, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { tokenAtom, firstAtom, paymentUserInfoAtom } from '../state/atoms'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){

    const navigate = useNavigate()

    const [ firstName, setFirstName ] = useRecoilState(firstAtom)
    const [ token, setToken ] = useRecoilState(tokenAtom)
    

    const [ userList, setUserList ] = useState([])
    const [ balance, setBalance ] = useState("")
    const [ filter, setFilter ] = useState("")
    const [ menu, setMenu ] = useState(false)
    const [ loginMessage, setLoginMessage ] = useState(true)
    const [ paymentBox, setPaymentBox ] = useState(false)
   
    
    useEffect(()=>{
        fetch("http://localhost:3000/api/v1/account/balance", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
        .then(async (fetchCall)=>{
            const fetchRes = await fetchCall
            const data = await fetchRes.json()

            setBalance(data.balance)
            
        })
    }, [paymentBox])
        

    useEffect(()=>{
        fetch("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(async (fetchCall)=>{
            
            const fetchRes = await fetchCall
            const data = await fetchRes.json()

            setUserList(data.users)
            setLoginMessage(false)
            console.log(data.users)
        })}, [filter])

    
    return <div className='relative bg-[#2b3137] text-slate-50'>
        {/* Header */}

        <div className="flex flex-row justify-between px-5 py-4 items-center w-full bg-black shadow-xl">
            {/* Logo */}
            <div className="text-2xl md:text-4xl font-bold md:mx-5 text-slate-50">
                PayPal
            </div>

            {/* Menu */}
            <div class="relative inline-block text-left">
            <div>
                <button type="button" onClick={()=>{setMenu(!menu)}} class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-green-600 md:px-3 md:py-2 p-1 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                    Menu
                    <svg class="-mr-1 h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className={`absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${menu?'visible':'hidden'}`}  role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="none">
                    <button type="submit" onClick={()=>{navigate("/")}} class="text-gray-700 block w-full px-4 py-2 text-left text-md font-semibold border-b-1 border-b" role="menuitem" tabindex="-1" id="menu-item-3">Signin</button>
                    <button type="submit" onClick={()=>{navigate("/signup")}} class="text-gray-700 block w-full px-4 py-2 text-left text-md font-semibold  border-b-1 border-b" role="menuitem" tabindex="-1" id="menu-item-3">Signup</button>
                    <button type="submit" onClick={()=>{
                        localStorage.removeItem("userInfo")
                        setToken("")
                        setFirstName("User")
                        setLoginMessage(true)
                        navigate("/")
                    }} class="text-gray-700 block w-full px-4 py-2 text-left text-md font-semibold" role="menuitem" tabindex="-1" id="menu-item-3">Logout</button>
                 </div>
            </div>
            </div>
            
            {/* User Message and Icon */}
            <div  className="flex flex-row justify-evenly md:w-2/12 w-6/12 items-center text-slate-50">
                <div className="text-lg font-light mx-2">Hello, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}</div>
                <div className="bg-green-500 text-slate-950 p-6 rounded-full h-[40px] relative">
                    <div className="absolute top-2 left-3.5 text-2xl font-bold">{firstName[0].toUpperCase()}</div>
                </div>
            </div>
        </div>

        {/* Loader */}
        <Loader loginMessage={loginMessage}></Loader>

        {/* Balance */}
        <div className={`text-3xl font-light m-6 ${loginMessage? "hidden": "block"}`}>
            Balance: <span className='text-4xl font-bold text-green-500'>₹{balance}</span>
        </div>

        {/* Search Bar */}
        <div className={`flex flex-col m-6  ${loginMessage? "hidden":"block"}`}>
        
            <input onChange={(e)=>{
                const capitalizedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                setFilter(capitalizedValue)
            }} type="text" placeholder='Search' className="placeholder:text-green-500 placeholder:font-light    shadow-lg w-[90%] m-auto border-2 border-green-500 bg-slate-700 h-10 px-2 text-xl outline-0"></input>
        </div>

        {/* Users List */}
        {userList && userList.map(user => {return <Person key={user._id} paymentBox={paymentBox} setPaymentBox={setPaymentBox} user={user}></Person> })}

        
    </div>
}

function Person({user, setPaymentBox, paymentBox}){
    const [ payInfo, setPayInfo ] = useRecoilState(paymentUserInfoAtom)
    const [ token, setToken ] = useRecoilState(tokenAtom)
    const [ id, setId ] = useState(user._id)

    return <>
    <div className="flex flex-col md:px-5 px-2 w-[90%] m-auto">              
        <div key={user._id} className="flex flex-row justify-start gap-3 md:gap-5 items-center md:px-5 px-2 py-3 my-2 border border-1 border-green-500 bg-slate-800 relative">
                <div className="bg-green-500 text-slate-950 p-6 rounded-full relative block md:block">
                    <p className='absolute md:top-2 md:left-3.5 top-2.5 left-4 font-bold md:text-2xl text-xl'>{user.firstName[0].toUpperCase()}</p>
                </div>
            <div className="flex flex-col justify-start w-1/2 md:w-[20%] align-left items-center">
                <div className='text-sm  md:text-md md:font-normal'>To: <span className='md:font-bold font-semibold text-normal text-left md:text-xl'>{user.firstName + " " + user.lastName}</span></div>
                <div className='text-xs md:text-md text-left'>({user.username})</div>
            </div>
            <div>
                <button onClick={()=>{
                    setId(user._id)
                    console.log(id)
                    setPaymentBox(!paymentBox)
                    fetch("http://localhost:3000/api/v1/user/getUser?id=" + id, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                        }
                    })
                    .then(async (res)=>{
                        const data = await res
                        const info = await data.json()
                        
                        setPayInfo(info.user)
                        console.log(payInfo)
                    })
                }} className="border border-3 border-black bg-green-500 text-black p-2 md:p-2 md:w-30 w-25 text-sm md:text-lg font-semibold absolute shadow-lg rounded-md right-5 top-4 md:top-3 hover:bg-white hover:text-slate-950">Payment</button>
            </div>
        </div>
    </div>

    <PaymentBox user={payInfo} setPaymentBox={setPaymentBox} paymentBox={paymentBox}></PaymentBox>
    </>
}

function Loader({loginMessage}){
    console.log(loginMessage)
    return <div className="text-8xl font-bold mt-[10%] text-center" style={{display: loginMessage? "block" : "none"}}>
        Loading...
    </div>
}

function PaymentBox({user, paymentBox, setPaymentBox}){
    const [ amount, setAmount ] = useState()
    const [ message, setMessage ] = useState("")
    const token = useRecoilValue(tokenAtom)

    useEffect(()=>{
        setMessage("")
    }, [paymentBox])
    

    return <div className={`flex flex-col justify-start shadow-sm rounded-xl gap-5 py-5 px-5 items-center bg-slate-950  fixed top-[200px] left-1/2 transform -translate-x-1/2 ${paymentBox? "block" : "hidden"}`}>
       
        <div onClick={()=>{
            setPaymentBox(false)
        }} className='text-slate-50 absolute right-0 top-0 px-3 bg-red-700 rounded-xl'>x</div>

        <div className='text-6xl font-bold text-slate-50'>Payment</div>
        <div className="bg-green-500 text-slate-950 p-6 rounded-full relative block md:block shadow-lg">
                <p className='absolute md:top-2 md:left-3.5 top-2.5 left-4 font-bold md:text-2xl text-xl '>{user.firstName[0]}</p>
        </div>
        <div className="flex flex-col justify-between w-full align-left">
            <div className='w-[300px] text-xl text-slate-50'>{"TO: " + user.firstName + " " + user.lastName}</div>
            <div className='text-lg text-slate-50'>{user.username}</div>
        </div>

        <div className='flex flex-col w-full'>
            <div className='text-slate-50 px-1 pb-1 font-light'>Amount</div>
            <input type='number' onChange={(e)=>{setAmount(e.target.value)}} className='w-full border border-3 border-green-500 bg-slate-700 px-2 py-1 text-xl outline-0 shadow-lg rounded'></input>
        </div>
        
        <button onClick={()=>{
            fetch("http://localhost:3000/api/v1/account/transfer", {
                method: "POST",
                body: JSON.stringify({
                    to: user._id,
                    amount: amount
                }),
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            })
            .then(async (res)=>{
                const data = await res
                const output = await data.json()
                setMessage(output.message)
            })
        }} className='bg-green-500 px-2 py-1 text-xl w-full rounded font-semibold text-slate-950 shadow-lg'>Pay</button>
        <div className='text-slate-50'>{message}</div>
    </div>
}

