let url = "http://127.0.0.1:5500/data/rajyaSabhaDataMin.json";

let fetchData = () => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            createTable(data.rajyasabha);
        });
};

fetchData();

let createRows = (table, data) => {
    console.log("updating rows...");
    let rows = table.selectAll("tr")
        .data(data, obj => {
            console.log("binding data...");
            if (obj !== undefined) {
                return obj.id;
            }
        })
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(obj => {
            console.log("adding rows...");
            console.log(obj);
            let arr = Object.values(obj);
            // console.log(arr);
            return arr;
        })
        .enter()
        .append("td")
        .text(value => value);
    
    rows.exit().remove();
};

let createTable = (data) => {

    d3.select('body')
        .append('div')
        .attr('id', 'container');

    d3.select("#container")
        .append("h1")
        .text("Rajyasabha");
    
    let searchBar = d3.select("#container")
        .append("input")
        .attr("id", "search")
        .attr("type", "Text")
        .attr("class", "SearchBar")
        .attr("placeholder", "Type Ministry Name");

    let table = d3.select("#container")
        .append("table")
        .attr("border", "1")
        .style("border-collapse", "collapse");

    let header = table.append("tr");

    let colNames = [];
    for (let col in data[0]) {
        colNames.push(col);
    }

    header.selectAll("th")
        .data(colNames)
        .enter()
        .append("th")
        .style("min-width", "150px")
        .text(col => col);
    
    //console.log(data);
    
    createRows(table, data);
    
    
    //search functionality 
    searchBar.on("keyup", function () {
        console.log("searching...");
        let query = this.value.trim();

        let searchResult = data.map((obj) => {
            let regx = new RegExp(`^${query}.*`, "i");
            if (regx.test(obj.ministry)) {
                return obj;
            }
        }).filter((item) => item !== undefined);

        console.log(searchResult);
        createRows(table, searchResult);
    });
     
    // data.forEach(obj => {
    //     let rows = table.append("tr");
    //     for (let key in obj) {
    //         console.log(key, obj[key]);
    //         rows.append("td")
    //             .text(obj[key]);
    //     }
    // });

    // let dataByMinistries = d3.nest()
    //     .key(obj => obj.ministry)
    //     .entries(data);

    // // console.log(dataByMinistries);

    // let dataByMinistriesUsers = dataByMinistries.map(element => {
    //     return d3.nest()
    //         .key(obj => obj.question_by)
    //         .entries(element.values);
    // });

    // let userCounts = dataByMinistriesUsers.map(users => {
    //     return users.reduce((prev, cur) => {
    //         // console.log(prev, cur);
    //         if (prev.values.length > cur.values.length) {
    //             return prev;
    //         }
    //         return cur;
    //     });
    // });

    // console.log(userCounts);

    // userCounts.forEach(obj => {
    //     let rows = table.append("tr");
    //     rows.append("th")
    //         .text(obj.values[0].ministry);

    //     rows.append("th")
    //         .text(obj.key);

    //     rows.append("th")
    //         .text(obj.values.length);
    // });

    // console.log(dataByMinistriesUsers);

};