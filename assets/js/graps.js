queue()
    .defer(d3.csv, "assets/data/election-2016.csv")
    .await(makeGraphs);



function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);



    // these are the working graphs 
    region_selector(ndx);
    constituency_selector(ndx);
    elected_selector(ndx);
    show_percent_that_are_professors(ndx, "F", "#percent-of-women-professors");
    show_percent_that_are_professors(ndx, "M", "#percent-of-men-professors");
    party_first_preference_graphs(ndx);
    candidate_graphs(ndx);






    // these are the graphs in test     

    party_total_votes_graphs(ndx);
    candidate_first_preferance_graphs(ndx);
    candidate_total_votes_graphs(ndx);
    candidate_graphs_v2(ndx);


    dc.renderAll();
}


// This is the working section 



function refreshPage() {
    window.location.reload();
}

function region_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Region'));
    group = dim.group();

    dc.selectMenu("#region-selector")
        .dimension(dim)
        .group(group);
}

function constituency_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Constituency_Name'));
    group = dim.group();

    dc.selectMenu("#constituency-selector")
        .dimension(dim)
        .group(group);
}

function elected_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Result'));
    group = dim.group();

    dc.selectMenu("#elected-selector")
        .dimension(dim)
        .group(group);
}

function party_first_preference_graphs(ndx) {

    var dim = ndx.dimension(dc.pluck('Party_Abbreviation'));
    var group = dim.group().reduceSum(dc.pluck('Count_1'));

    dc.pieChart('#party_first_preference_graphs') 
        .height(360)
        .width(360)
        .innerRadius(95)
        .transitionDuration(1500)
        .colors(d3.scale.ordinal().range(["#8B8C8A", "#00A3DF", "#12A853", "#014B45", "#D6323D", "#91B905"]))
        .dimension(dim)
        .renderLabel(true)
        .legend(dc.legend().x(150).y(130).itemHeight(14).gap(5))
        .title(function(d) {
            return d.key + ": " + ((d.value / d3.sum(group.all(),
                function(d) { return d.value; })) * 100).toFixed(2) + "%";
        })
        .on("pretransition", function(chart) {
            chart.selectAll("text.pie-slice").text(function(d) {
                if (dc.utils.printSingleValue(
                        (d.endAngle - d.startAngle) /
                        (2 * Math.PI) * 100) >= 6) {
                    return dc.utils.printSingleValue(
                        (d.endAngle - d.startAngle) /
                        (2 * Math.PI) * 100) + "%";
                }
            })
        })
        .group(group);
}


function candidate_graphs(ndx) {
    var dim = ndx.dimension(dc.pluck('Party_Abbreviation'));
    var group = dim.group().reduceSum(dc.pluck('Seat'));

    dc.rowChart("#candidate-graph")
        .width(600)
        .height(400)
        .colors(d3.scale.ordinal().range(["#00A3DF", "#12A853", "#8B8C8A", "#014B45", "#D6323D", "#91B905"]))
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .transitionDuration(1500)
        .elasticX(true)
        .group(group);
}

































//this is the testing section 





function candidate_graphs_v2(ndx) {

    var partyColors = d3.scale.ordinal()
        .domain(["F.G.", "F.F.", "Others", "S.F.", "LAB.", "G.P."])
        .range(["pink", "blue", "red", "yellow", "black", "green"]);

    var dim = ndx.dimension(dc.pluck('Party_Abbreviation'));
    var group = dim.group().reduceSum(dc.pluck('Seat'));


    var party_color = ndx.dimension(function(d) {
        return [d.Party_Abbreviation, d.Seat];
    });

    var partyGroup = party_color.group();

    console.log(group.all());


    dc.barChart("#candidate-graph-v2")
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        // .colorAccessor(function(d) {
        //     return d.key[0];
        // })
        .colors(d3.scale.ordinal().range(["#e6550e", "#fd8c3d", "#3182bc", "#fd8c3d", "#fd8c3d", "#fd8c3d", "#fd8c3d"]))
        .group(group)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Region")
        .yAxis().ticks(10);


}


function party_total_votes_graphs(ndx) {
    var dim = ndx.dimension(dc.pluck('Party_Abbreviation'));
    var group = dim.group().reduceSum(dc.pluck('Seat'));

    dc.pieChart('#party_total_votes_graphs') /* targeting the div where we want the pie chart*/
        .height(360)
        .width(360)
        .innerRadius(95)
        .transitionDuration(1500)
        // .colors(d3.scale.ordinal().range(["#3182bc", "#fd8c3d", "#e6550e"]))
        .dimension(dim)
        .renderLabel(true)
        .legend(dc.legend().x(150).y(130).itemHeight(14).gap(5))
        // .radius(360)
        .group(group)
        .title();
}















// function party_total_votes_graphs(ndx) {

//     var dim = ndx.dimension(dc.pluck('Party_Abbreviation'));
//     var group = dim.group().reduceSum(dc.pluck('Total_Votes'));

//     dc.pieChart('#party_total_votes_graphs') /* targeting the div where we want the pie chart*/
//         .height(360)
//         .width(360)
//         .innerRadius(95)
//         .transitionDuration(1500)
//         // .colors(d3.scale.ordinal().range(["#3182bc", "#fd8c3d", "#e6550e"]))
//         .dimension(dim)
//         .renderLabel(true)
//         .legend(dc.legend().x(110).y(150).itemHeight(13).gap(5))
//         // .title(function(d) {
//         //     return d.key + ": " + ((d.value / d3.sum(group.all(),
//         //         function(d) { return d.value; })) * 100).toFixed(0) + "%";
//         // })
//         .on("pretransition", function(chart) 
//         {
//             chart.selectAll("text.pie-slice").text(function(d) {
//                 if (dc.utils.printSingleValue(
//                         (d.endAngle - d.startAngle) /
//                         (2 * Math.PI) * 100) >= 6) {
//                     return dc.utils.printSingleValue(
//                         (d.endAngle - d.startAngle) /
//                         (2 * Math.PI) * 100) + "%";
//                 }
//             }
//             )
//             chart.select("svg")
//                 .attr("height", "100%")
//                 .attr("width", "100%")
//                 .attr("viewBox", "0 0 360 360");
//             chart.selectAll(".dc-legend-item text")
//                 .attr("fill", "#1D47FF")
//                 .text("")
//                 .append("tspan")
//                 .text(function(d) { return d.name; })
//                 .attr("x", 70)
//                 .attr("text-anchor", "end");
//         })
//         .group(group);
// }










function candidate_first_preferance_graphs(ndx) {
    var dim = ndx.dimension(dc.pluck('Candidate'));
    var group = dim.group().reduceSum(dc.pluck('Count_1'));


    dc.pieChart('#candidate-first-preferance-graph') /* targeting the div where we want the pie chart*/
        .height(360)
        .width(360)
        .radius(360)
        .innerRadius(95)
        .transitionDuration(1500)
        .dimension(dim)
        .group(group);
}

function candidate_total_votes_graphs(ndx) {
    var dim = ndx.dimension(dc.pluck('Candidate'));
    var group = dim.group().reduceSum(dc.pluck('Total_Votes'));


    dc.pieChart('#candidate-total-votes-graph') /* targeting the div where we want the pie chart*/
        .height(250)
        .radius(100)
        .innerRadius(30)
        .transitionDuration(1500)
        .dimension(dim)
        .group(group);
}












// Everything under here is in test

function show_percent_that_are_professors(ndx, gender, element) {
    var percentageThatAreProf = ndx.groupAll().reduce(
        function(p, v) {
            if (v.Gender === gender) {
                p.count++;
                if (v.Result === "Elected") {
                    p.are_prof++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.Gender === gender) {
                p.count--;
                if (v.Result === "Elected") {
                    p.are_prof--;
                }
            }
            return p;
        },
        function() {
            return { count: 0, are_prof: 0 };
        },
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.are_prof / d.count);
            }
        })
        .group(percentageThatAreProf)
}













































// function show_revenue_graphs(ndx) {
//     var dim = ndx.dimension(dc.pluck('Candidate'));
//     var group = dim.group().reduceSum(dc.pluck('Total_Votes'));
//     // var group = dim.group();

//     dc.rowChart("#revenue-graph")
//         .width(600)
//         .height(2000)
//         .margins({ top: 10, right: 50, bottom: 30, left: 50 })
//         .dimension(dim)
//         .group(group);
// .transitionDuration(500)
// .x(d3.scale.ordinal())
// .xUnits(dc.units.ordinal)
// .elasticY(true)
// .xAxisLabel("Region")
// .yAxis().ticks(10);


// }


// function candidate_graphs(ndx) {
//     var dim = ndx.dimension(dc.pluck('Candidate'));
//     var group = dim.group().reduceSum(dc.pluck('Constituency_Name'));

//     dc.barChart("#candidate-graph")
//         .width(600)
//         .height(300)
//         .margins({ top: 10, right: 50, bottom: 30, left: 50 })
//         .dimension(dim)
//         .group(group)
//         .transitionDuration(500)
//         .x(d3.scale.ordinal())
//         .xUnits(dc.units.ordinal)
//         .elasticY(true)
//         .xAxisLabel("Region")
//         .yAxis().ticks(10);

// }
