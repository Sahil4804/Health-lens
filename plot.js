function renderGraphs() {
    // Select chart dimensions and margin based on SVG dimensions
    const width = 628;
    const height = 300;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

   
    // Create the SVG container
    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;")
        .style("-webkit-tap-highlight-color", "transparent")
        .style("overflow", "visible");

        
    // Load and render first dataset
    d3.csv("step_hourly1.csv").then(function(data1) {
        // Convert date strings to JavaScript Date objects and parse step counts as integers
        data1.forEach(function(d) {
            // Convert ActivityHour to a Date object
            d.ActivityHour = new Date(d.ActivityHour);
            // Parse the time part of ActivityHour without considering the date
            d.ActivityHour = d.ActivityHour.toLocaleTimeString('en-US', { hour12: false });
            d.StepTotal = +d.StepTotal;
        });

        // Load and render second dataset
        d3.csv("step_hourly2.csv").then(function(data2) {
            // Convert date strings to JavaScript Date objects and parse step counts as integers
            data2.forEach(function(d) {
                // Convert ActivityHour to a Date object
                d.ActivityHour = new Date(d.ActivityHour);
                // Parse the time part of ActivityHour without considering the date
                d.ActivityHour = d.ActivityHour.toLocaleTimeString('en-US', { hour12: false });
                d.StepTotal = +d.StepTotal;
            });

            // Declare the x (horizontal position) scale
            const x = d3.scaleBand()
                .domain(data1.map(d => d.ActivityHour)) // Use the time part of ActivityHour as the domain
                .range([marginLeft, width - marginRight])
                .padding(0.1);

            // Declare the y (vertical position) scale
            const y = d3.scaleLinear()
                .domain([0, d3.max([...data1, ...data2], d => d.StepTotal)])
                .range([height - marginBottom, marginTop]);

            // Create a line generator for data1
            const line1 = d3.line()
                .x(d => x(d.ActivityHour) + x.bandwidth() / 2)
                .y(d => y(d.StepTotal));

            // Create text elements for maximum step count of both datasets
            svg.append("text")
            .attr("x", width / 2)
            .attr("y", marginTop - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Today Steps: " + d3.max(data1, d => d.StepTotal))
            .style("fill", "#E64A19"); // Color for the first dataset

            svg.append("text")
            .attr("x", width / 2)
            .attr("y", marginTop - 10 + 20) // Adjust the vertical position as needed
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Average Steps: " + d3.max(data2, d => d.StepTotal))
            .style("fill", "#546E7A"); // Color for the second dataset


            // Append a line connecting the data points for data1
            svg.append("path")
                .datum(data1)
                .attr("fill", "none")
                .attr("stroke", "#E64A19")    
                .attr("stroke-width", 4)
                .attr("d", line1);

            // Create a line generator for data2
            const line2 = d3.line()
                .x(d => x(d.ActivityHour) + x.bandwidth() / 2)
                .y(d => y(d.StepTotal));

            // Append a line connecting the data points for data2
            svg.append("path")
                .datum(data2)
                .attr("fill", "none")
                .attr("stroke", "#546E7A")
                .attr("stroke-width", 4)
                .attr("d", line2);

            // Add circles for data1
            svg.selectAll(".circle1")
                .data(data1)
                .enter()
                .append("circle")
                .attr("class", "circle1")
                .attr("cx", d => x(d.ActivityHour) + x.bandwidth() / 2)
                .attr("cy", d => y(d.StepTotal))
                .attr("r", 4)
                .attr("fill", "#BF360C")
                .on("mouseover", pointermoved)
                .on("mouseout", pointerleft);

            // Add circles for data2
            // svg.selectAll(".circle2")
            //     .data(data2)
            //     .enter()
            //     .append("circle")
            //     .attr("class", "circle2")
            //     .attr("cx", d => x(d.ActivityHour) + x.bandwidth() / 2)
            //     .attr("cy", d => y(d.StepTotal))
            //     .attr("r", 4)
            //     .attr("fill", "green")
            //     .on("mouseover", pointermoved)
            //     .on("mouseout", pointerleft);

            // Create the tooltip container
            const tooltip = svg.append("g")
                .style("display", "none");

            tooltip.append("text")
                .attr("x", 10)
                .attr("dy", "-1.2em");

            // Function to show tooltip
            function pointermoved(event, d) {
                tooltip.style("display", "block");
                tooltip.attr("transform", `translate(${x(d.ActivityHour) + x.bandwidth() / 2}, ${y(d.StepTotal)})`);
                tooltip.select("text").text(formatDate(d.ActivityHour) + ", Steps: " + formatValue(d.StepTotal));
            }

            // Function to hide tooltip
            function pointerleft() {
                tooltip.style("display", "none");
            }

            // Function to format value
            function formatValue(value) {
                return value.toLocaleString("en");
            }

            // Function to format date
            function formatDate(date) {
                return date;
            }

            // Add the x-axis
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            // Add the y-axis
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 40))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("↑ Number of Steps"));
        });
    });
}

// Render both graphs
 renderGraphs();


