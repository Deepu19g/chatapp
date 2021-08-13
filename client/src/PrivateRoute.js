import React from 'react'
import { Link, Redirect,useParams } from 'react-router-dom'
import ChatLanding from './ChatLanding'

function PrivateRoute() {
   let {auth,email}=useParams()
   
    return (
        <div>
           {auth? <ChatLanding email={email}></ChatLanding>:<Redirect to="/Login"></Redirect>}
        </div>
    )
}

export default PrivateRoute
