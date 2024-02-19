import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url)
{
    const [data, setData] = useState([]);
    useEffect(() => {
        axios(url)
        .then((data) => {
            setData(data);
        })
        .catch((error) => {
            console.log(error); // 오류가 발생한 경우, 콘솔에 로그를 출력합니다.
        });
    }, [url]);

    return data;
}