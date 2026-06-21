import React from 'react'
import { useNavigate, useParams } from "react-router-dom";

function Room() {
  const { id } = useParams();
  return (
    <div>
      <h1>Room ID: {id}</h1>
    </div>
  );

}

export default Room