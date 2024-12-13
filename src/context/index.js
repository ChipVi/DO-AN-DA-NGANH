// APP CONTEXT PROVIDERS
// KO LIÊN QUAN ĐẾN AuthContextProvider

import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const username = 'DOANHUE'
const key = 'aio_CcJS04KmCKDIfaukhqQCyKblYE9D'

// lay gia tri cuoi cung tu ada
async function getLastValue (feed_id){
    const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feed_id}/data/last`;
    const options = {
        headers: {
          'X-AIO-Key': key
        }
      };
    let res = await axios.get(url, options);
    return res.data.value;
}

const AppContext = createContext();


const AppProvider = (props) => {
    // thiet lap các giá trị ban đầu cho các sensor, hàm điều chỉnh sensor
    const [temperature, setTemperature] = useState(0);
    const [lightIntensity, setLightIntensity] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [lightBtn, setLightBtn] = useState(false);
    const [pumperBtn, setPumperBtn] = useState(false);
    const [airBtn, setAirBtn] = useState(false);
    const [strawStatus, setStrawStatus] = useState("Good");

    // giai đoạn lấy dữ liệu từ adafruit.com lúc đầu

    useEffect(()=>{
       const defaultValue = async () => {
        setTemperature(await getLastValue('temperature-sensor'))
        setLightIntensity(await getLastValue('light-sensor'))
        setHumidity(await getLastValue('humidity-sensor'))
        setLightBtn(await getLastValue('led'))
        setPumperBtn(await getLastValue('pumper'))
        setAirBtn(await getLastValue('fan'))
        setStrawStatus(await getLastValue('strawberry-status'))
       }
       defaultValue()
    }, [])
    
    return <AppContext.Provider 
    value={{temperature,setTemperature,
        lightIntensity,setLightIntensity,humidity,
        setHumidity,lightBtn,setLightBtn,pumperBtn,setPumperBtn,airBtn,setAirBtn,strawStatus,setStrawStatus
    }}
    >
        {props.children}
    </AppContext.Provider>
}

export default AppProvider;

// create biến useGlobalContext chứa các giá trị của các sensor và sử dụng chúng
export const useGlobalContext  = () => {
    return useContext(AppContext);
}
