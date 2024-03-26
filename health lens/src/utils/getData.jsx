
import * as d3 from 'd3'


var arr=[]

export const csv_data = async function(){
    arr=await d3.csv("../../Datasets/output.csv")
}
export const getData = (interval,index) => {


  // console.log("arr length ",arr.length)
  // console.log("arr elem",arr[0])
  // console.log(index)
  var data = [],
    time = (new Date()).getTime();

  const minutes = getNumber()
  const hours = minutes / 60
  var prev = 0;
  var start1=index+1;
    var end1=index+minutes;
    // console.log("start1 ",start1,"end1 ",end1)
  for (var i = start1; i <= end1; i ++) {
    data.push({
      date: time + i * interval,
      value: parseInt(arr[i].Value),
      category: 'heart_rate'
    })
    data.push({
      date: time + i * interval,
      value: Math.abs(data[data.length - 1].value - prev)/5,
      category: 'heart_intensity'
    })
    prev = data[data.length - 1].value
  
  }
  return { 'heart': data, hours }
}





function getNumber() {
  if (Math.min(window.innerWidth) > 1024 & Math.min(window.innerWidth) <= 1366 & Math.abs(window.screen.orientation.angle === 90)) {
    return 60
  }
  else if (Math.min(window.innerWidth) <= 1024 & (Math.abs(window.screen.orientation.angle === 90))) {
    return 60
  }
  else if (Math.min(window.innerWidth) <= 1024 & (Math.abs(window.screen.orientation.angle === 0))) {
    return 30
  }
  else if (Math.min(window.innerWidth) > 1024) {
    return 120
  }
  else if (Math.min(window.innerWidth) > 1680) {
    return 360
  }
  else {
    return 120
  }

}
