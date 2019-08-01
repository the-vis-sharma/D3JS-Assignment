let url1 = "http://127.0.0.1:5500/data/rajyasabha2014.json";
let url2 = "http://127.0.0.1:5500/data/rajyasabha2015.json";
let url3 = "http://127.0.0.1:5500/data/rajyasabha2016.json";

let fetchData = () => {

    let allData = [];
    fetch(url1)
        .then(res1 => res1.json())
        .then(data1 => {
            allData = allData.concat(data1);
            fetch(url2)
                .then(res2 => res2.json())
                .then(data2 => {
                    allData = allData.concat(data2);
                    fetch(url3)
                        .then(res3 => res3.json())
                        .then(data3 => {
                            allData = allData.concat(data3);
                            // console.log(allData);
                            createBarChart(allData);
                        });
                });
        });
};

fetchData();


let createBarChart = (data) => {

    const svg = d3.select("svg"),
        margin = 50,
        width = +svg.attr("width") - (2 * margin),
        height = +svg.attr("height") - (2 * margin),
        x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        y = d3.scaleLinear().rangeRound([height, 0]),
        g = svg.append("g")
            .attr("transform", `translate(${margin},${margin})`);
    
    let dataByMinistries = d3.nest()
        .key(obj => obj.ministry)
        .entries(data);

    let requiredMinistries = ["HOME AFFAIRS", "COMMERCE AND INDUSTRY", "MINES"];
    let filteredMinistries = dataByMinistries.filter(obj => requiredMinistries.indexOf(obj.key) !== -1);
    
    // console.log(filteredMinistries);
    let matchedData = filteredMinistries.map((obj) => {
        return { "ministry": obj.key, "count": obj.values.length }
    });
    // console.log(matchedData);

    x.domain(matchedData.map(obj => obj.ministry));
    y.domain([0, d3.max(matchedData, obj => obj.count)]);

    g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y).ticks(10).tickSize(8));

    g.selectAll(".bar")
        .data(matchedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", obj => x(obj.ministry))
        .attr("y", obj => y(obj.count))
        .attr("width", x.bandwidth())
        .attr("height", obj => height - y(obj.count));

};