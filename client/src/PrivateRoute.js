import React from 'react'
import { useParams } from 'react-router-dom'
import ChatLanding from './ChatLanding'

function PrivateRoute() {
   let {email}=useParams()
   
   
    return (
        <div>
      <ChatLanding email={email}></ChatLanding>
        </div>
    )
}

export default PrivateRoute
