import React, { useState, useEffect } from 'react';
import axios from "axios";
function HotelsAround() {
    const [displayData, setDisplayData] = useState(null);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                axios.post('http://localhost:9090/services/hotelsAutoFill/fetchHotels',{
                    "lat" : position.coords.latitude,
                    "lng" : position.coords.longitude,
                    "inAndAroundRadius": 10
                }).then(response => {
                    console.log("got nearby hotels:",response.data);
                    setDisplayData(response.data.map(
                        (row)=>{ console.log("Got row:"+row.name);
                                 return( <p>{row.name}</p>)
                        }
                    ))
                }).catch(err => {
                    console.log("error in request", err);
                });
        });
    }
},[])
    return (<span><div>{displayData}</div></span>)
}

export { HotelsAround };   
