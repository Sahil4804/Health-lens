import React from "react";

import CalendarHeatmap from "react-calendar-heatmap";
import { heatmapdata } from "./submission_calendar_data";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;
import { useState } from "react";
import "./submission_calendar.css";

const today = new Date();
const map_month_to_number = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};
function Heatmap() {
  const [globaldata, setglobaldata] = useState(heatmapdata.reverse());
  const [heatmap, setheatmap] = useState(heatmapdata.reverse());
  const globaldata2 = getRange(365).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: heatmap[index],
    };
  });
  const data = getRange(365).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: heatmap[index],
    };
  });
  function handleChange(dates) {
    console.log("viola");
    if(dates==null){
        setheatmap(globaldata);
    }
    var newdating = [];
    for (var i = 0; i < data.length; i++) {
      const date = globaldata2[i].date; // Assuming data[i].date is a Date object

      // Extracting month, day, and year
      const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
      const day = date.getDate();
      const year = date.getFullYear();

      if (
        new Date(year, month, day) >= dates[0].$d &&
        new Date(year, month, day) <= dates[1].$d
      ) {
        newdating.push(globaldata2[i].count);
      } else {
        newdating.push(0);
      }
    }
    console.log(newdating);
    setheatmap(newdating);
  }
  return (
    <div
      style={{
        width: "80vw",
        position: "absolute",
        top: "20vh",
        marginLeft: "10vw",
      }}
    >
      <CalendarHeatmap
        startDate={shiftDate(today, -365)}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `${value.count}` < 5
            ? `color-github-${value.count}`
            : `color-github-5`;
        }}
        tooltipDataAttrs={(value) => {
          return {
            "data-tip": `${value.count} submissions on ${value.date
              .toString()
              .slice(4, 15)}`,
          };
        }}
        showWeekdayLabels={true}
      />

      <Space direction="vertical" size={12}>
        <RangePicker
          onChange={(dates) => {
            handleChange(dates);
          }}
        />
      </Space>
    </div>
  );
}

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

function getRange(count) {
  return Array.from({ length: count }, (_, i) => i);
}   

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Heatmap;
