import React from 'react'
import PrivateChat from './PrivateChat'
import { useParams } from 'react-router-dom';

export default function SendMassege() {
  const params = useParams();

  
   
  return (
    <div>
        <h1 style={{ fontFamily: "inherit", fontSize: "50px", textAlign: "center",color: "#7c99ab" }}>   { params.userName} צ'אט עם   </h1>
        <PrivateChat user2={params.userName} />
  </div> 
  


)
}
