import React, {useState} from 'react'
import Calendar from 'react-calendar'
import './Calender.css'

function Calender() {
    const {value, onchange} = useState(new Date());
  return (
    <div>
        <Calendar value={value} onchange={onchange} />
    </div>
  )
}

export default Calender
