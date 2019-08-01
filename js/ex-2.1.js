let url1 = "http://127.0.0.1:5500/data/rajyasabha2014.json";
let url2 = "http://127.0.0.1:5500/data/rajyasabha2015.json";
let url3 = "http://127.0.0.1:5500/data/rajyasabha2016.json";

let fetchData = () => {
    // httpHandler = new XMLHttpRequest();
    // httpHandler.onreadystatechange = function() {
    //     // console.log("this method is called" + this.readystate + " " + this.status);
    //     if (this.readyState == 4 && this.status == 200) {
    //         // console.log(this.responseText);
    //         let data = JSON.parse(this.responseText);
    //         // console.log(data.rajyasabha[0]);
    //         createTable(data.rajyasabha);
    //     }
    // };

    // httpHandler.open("GET", url, true);
    // httpHandler.send();


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
                            createTable(allData);
                        });
                });
        });
};

 fetchData();


let createTable = (data) => {

    let colNames = [];
    for (let col in data[0]) {
        colNames.push(col);
    }
    // console.log(colNames);

    d3.select('body')
        .append('div')
        .attr('id', 'container');
    
    d3.select("#container")
        .append("h1")
        .text("Rajyasabha");
    
    let table = d3.select("#container")
        .append("table")
        .attr("border", "1")
        .style("border-collapse", "collapse");
    
    // let header = table.append("tr");
    
    // header.selectAll("th")
    //     .data(colNames)
    //     .enter()
    //     .append("th")
    //     .style("min-width", "150px")
    //     .text(col => col);
    
    // data.forEach(obj => {
    //     let rows = table.append("tr");
    //     for (let key in obj) {
    //         console.log(key, obj[key]);
    //         rows.append("td")
    //             .text(obj[key]);
    //     }
    // });
    
    let dataByMinistries = d3.nest()
        .key(obj => obj.ministry)
        .entries(data);
    
    // console.log(dataByMinistries);

    let dataByMinistriesUsers = dataByMinistries.map(element => {
        return d3.nest()
            .key(obj => obj.question_by)
            .entries(element.values);
    });

    let userCounts = dataByMinistriesUsers.map(users => {
        return users.reduce((prev, cur) => {
            // console.log(prev, cur);
            if (prev.values.length > cur.values.length) {
                return prev;
            }
            return cur;
        });
    });

    console.log(userCounts);

    userCounts.forEach(obj => {
        let rows = table.append("tr");
        rows.append("th")
            .text(obj.values[0].ministry);

        rows.append("th")
            .text(obj.key);
        
        rows.append("th")
            .text(obj.values.length);
    });

    // console.log(dataByMinistriesUsers);
    
};