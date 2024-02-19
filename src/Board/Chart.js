import React from 'react'
import { PieChart } from 'react-minimal-pie-chart';

function Chart() {
  const data = [{ title: 'One', value: 10, color: '#FDC308' },{ title: 'Two', value: 15, color: '#FA6989' },{ title: 'Three', value: 20, color: '#55A7F9' },];
  return (
    <PieChart data={data} label={({dataEntry}) => dataEntry.value} animate/>
  )
}

export default Chart
