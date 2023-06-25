import React, { useContext, useEffect, useState } from "react";
import { Polyline, InfoWindow } from "react-bmapgl";
import { timeContext } from "../../../Mymap";
import { Vehicle } from "../../Vehicle/Vehicle";
import axios from "axios";
export const CarTraceAbnormal = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const {tick, mapsec} = useContext(timeContext);
  const [vehicleData, setVehicledata] = useState({});
  const [curLoc, setCurLoc] = useState({});
  const [curTrace, setCurTrace] = useState([]);
  const [preDevices, setPreDevices] = useState([]);
  useEffect(() => {
    axios.get(`Data/display/Scene1/dataWrong/${props.carId}.json`)
      .catch(function (response) {
        console.log(response)
      })
      .then(function (res) {
        const newdata = res['data']
        console.log(newdata)
        setVehicledata(
          newdata
        )
        setPreDevices([newdata['0']])
      }
    )
  }, []);

  useEffect(() => {
    let curLocTemp = vehicleData[tick * 20000]
    if(curLocTemp === undefined) {
      return;
    }
    if(Object.keys(curLocTemp).length >= 3) {
      setPreDevices([...preDevices, curLocTemp])
      setCurLoc(curLocTemp["loc"])
    }
    else{
      setCurLoc(curLocTemp)
    }
    // console.log(preDevices.map((device) => device["loc"]))
    // console.log
    setCurTrace(
      [ 
        ...preDevices.map((device) => device["loc"]),
        curLoc
      ]
    )
    // console.log(curTrace)
  },[tick]);


  const debug_info = () => {
    setShowInfo(true);
    // console.log("click");
  };
  


  return (
    <React.Fragment>
      { curLoc !== undefined && 
        <Vehicle
          pos={curLoc}
        />
      }
      {curTrace.length >= 2 && <Polyline
        path={curTrace}
        strokeColor={props.strokeColor || "#c22f14"}
        cord="bd09ll"
        strokeWeight={props.strokeWeight || 5}
        onClick={debug_info}
      /> }
    </React.Fragment>
  );
};