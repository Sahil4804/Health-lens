import React from 'react';
import './Sleeptracker.css';
import { useEffect } from 'react';
const generateRandomDataset = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const randomizedDataset = daysOfWeek.map(day => {
        const randomValues = [];
        let total = 0;
        // Generate three random numbers
        for (let i = 0; i < 3; i++) {
            const randomValue = Math.floor(Math.random() * (100 - total));
            randomValues.push(randomValue);
            total += randomValue;
        }
        // Calculate the fourth number to ensure total is 100
        randomValues.push(100 - total);
        // Shuffle the values to ensure randomness
        randomValues.sort(() => Math.random() - 0.5);
        return { [day]: randomValues };
    });
    return randomizedDataset;
};

const randomizedDataset = generateRandomDataset();
console.log(randomizedDataset);

const StackedBarChart = () => {
    useEffect(() => {
        // Function to set width based on text content
        const setWidthBasedOnText = () => {
            document.querySelectorAll('.value').forEach((element) => {
                const id = element.id;
                // find the parent element
                const parent = element.parentElement;
                if (id === "A") {
                    parent.style.backgroundColor = '#334D5C';
                }
                if (id === 'B') {
                    parent.style.backgroundColor = '#45B29D';
                }
                if (id === 'C') {
                    parent.style.backgroundColor = '#EFC94C';
                }
                if (id === 'D') {
                    parent.style.backgroundColor = '#E27A3F';
                }
            
                
                const text = element.textContent;
                element.parentElement.style.width = text;
            });
        };

        // Call the function on component mount
        setWidthBasedOnText();

        // Initialize tooltips
        document.querySelectorAll('.block').forEach((element) => {
            // Add tooltip logic here
            // For example, you can use native browser tooltip:
            element.title = element.getAttribute('title');
        });

        // Clean up on component unmount (optional)
        return () => {
            // Any cleanup code here
        };
    }, []); // Run effect only once on component mount
    const [sleeparr, setSleeparr] = React.useState(
        [
            { "Mon": [20, 30, 40, 10] },
            { "Tue": [10, 20, 30, 40] },
            { "Wed": [30, 20, 10, 40] },
            { "Thu": [40, 30, 20, 10] },
            { "Fri": [50, 10, 20, 20] },
            { "Sat": [60, 20, 10, 10] },
            { "Sun": [70, 20, 10, 0] }
        ]
    );
    var x = []
    var pos = {}
    const days =[ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for (var index = 0; index < sleeparr.length; index++) {
        var temp = [...sleeparr[index][Object.keys(sleeparr[index])]]
        x.push(sleeparr[index][Object.keys(sleeparr[index])])
        x[index].sort((a, b) => a - b)
        var tt = []
        for (var i = 0; i < x[index].length; i++) {
            for (var j = 0; j < temp.length; j++) {
                if (x[index][i] == temp[j]) {
                    tt.push(j)
                    temp[j] = -1
                }

            }
        }
        pos[days[index]]= tt;
    }
    // console.log(pos);

        return (
            <figure className='parent-sleeptracker'>
                {/* <div className="y-axis">
                <h3>Y-Axis Title</h3>
            </div> */}

                <div className="graphic">
                    {
                        sleeparr.map((day, index) => {
                            // console.log(pos[Object.keys(day)]);
                            return (
                                <div className="row" key={index}>
                                    <h6>{Object.keys(day)}</h6>
                                    <div className="chart">
                                        {
                                            Object.values(day)[0].map((value, index) => {
                                                const dd = String.fromCharCode(65 + pos[Object.keys(day)][index])
                                                const newid = dd+"-day"
                                                return (

                                                    <span className="block" id={newid} key={index} title={`Category ${String.fromCharCode(65 + pos[Object.keys(day)][index])}`}>
                                                        <span className="value" id={String.fromCharCode(65 + pos[Object.keys(day)][index])}>{value}%</span>
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })

                    }
                </div>

                <div className="x-axis">
                    {/* <h3>X-Axis Title</h3> */}
                    <ul className="legend">
                        <li className='A' >Category A</li>
                        <li className='B'>Category B</li>
                        <li className='C'>Category C</li>
                        <li className='D'>Category D</li>
                    </ul>
                </div>
            </figure>
        );
    }

    export default StackedBarChart;
