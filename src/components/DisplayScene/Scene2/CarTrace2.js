import React, { useContext, useEffect, useState } from "react";
import { Polyline, Label } from "react-bmapgl";
import { timeContext } from "../../../Mymap";
import axios from "axios";
import { Vehicle } from "../../Vehicle/Vehicle";
export const CarTrace2 = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const {tick, mapsec} = useContext(timeContext);
  const [isFinished,setFinished] = useState(false);
  const [vehicleData, setVehicledata] = useState({});
  const [curLoc, setCurLoc] = useState({});
  const [curTrace, setCurTrace] = useState([]);
  const [preDevices, setPreDevices] = useState([]);
  useEffect(() => {
    axios.get(`Data/display/Scene2/data/${props.carId}.json`)
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
      if(tick > 200 && isFinished === false){
        setFinished(true)
        console.log('end')
      }
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
    setCurTrace(
      [ 
        ...preDevices.map((device) => device["loc"]),
        curLoc
      ]
    )
    
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
      { isFinished === false && curTrace.length >= 2 && <Polyline
        path={curTrace}
        strokeColor={props.strokeColor || "#070FF3"}
        cord="bd09ll"
        strokeWeight={props.strokeWeight || 5}
        onClick={debug_info}
      /> }
      {
        isFinished === true &&         
        <Label
          position={curLoc}
          text={`${props.carId} 违反倒换卡`}
        />
      }
    </React.Fragment>
  );
};
