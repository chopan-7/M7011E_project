import {useState, useEffect} from 'react'
const useProsumerOverview = () =>{
    const [values, setValues] = useState({
        wind:'',
        production:'',
        consumption:'',
        net_production:'',
        battery:'',
        marketprice:''
        
    })
        
    useEffect(async () => {
        const response = await fetch("https://randomuser.me/")
        const data = await response.json()
        const [item] = data.results
        setValues(item) 
    }, [])
    
    return (
        <div> 
          
          <p>Current wind {values.wind}</p>
          <p>Current production {values.production}</p> 
          <p>Current consumtion {values.consumption}</p> 
          <p>Current net production {values.net_production}</p> 
          <p>Current battery level {values.battery}</p> 
          <p>Current marketprice {values.marketprice}</p>   
        </div>
    )
}

export default useProsumerOverview