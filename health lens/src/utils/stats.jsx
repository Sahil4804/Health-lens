import * as d3 from "d3"


export function getStats(data, categories) {
  // console.log(Object.entries(categories));
  const {heart, blood_pulse} = data
  const dataNew = [...heart, ...blood_pulse]

  let stats = []
  for (const [key, value] of Object.entries(categories)) {
    // dataNew.map(el=>console.log(el.category))
    const tmp = dataNew.filter(el=>el.category === key)
    const max_value = tmp[tmp.length-1].value
    const mean_value = d3.mean(tmp.map(el=>el.value))
    stats.push({
      category : key,
      label: value,
      maximum: Math.round(max_value * 100) / 100,
      average :  Math.round(mean_value * 100)/100,
    })
  }

  return stats
}
