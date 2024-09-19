import React, { useState, useEffect } from "react";
import axios from "axios";

function Try() {
    const [data, setData] = useState('')
    useEffect(()=>{
            axios.get('http://127.0.0.1:5000/')
            .then((res)=>{
                setData(res.data)
            })
    },[])
    return (<div>
        <p>{data}</p>
    </div>)
}
export default Try;