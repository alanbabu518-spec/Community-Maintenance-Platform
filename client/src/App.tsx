import { useEffect, useState } from "react";

function App(){

  const [backendStatus,setBackendStatus] = useState("checking...");

  useEffect(()=>{
    fetch("http://localhost:5000/api/health")
    .then((response)=>response.json())
    .then((data)=>{
      if(data.status === "ok"){
        setBackendStatus("Connected!");
      }
    })
    .catch(()=>{
      setBackendStatus("Not Connected!")
    })
  },[])

  return(
    <div>
      <h1>Community Maintenance Platform</h1>
      <p>Backend: {backendStatus}</p>
    </div>
  )
}

export default App;