/**
 * Created by anushamuthyampeta on 5/11/17.
 */
/**
 * Created by anushamuthyampeta on 4/23/17.
 */

    var margin = {top: 20, right: 20, bottom: 150, left: 100},
        width = 1400 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

//document.getElementsByTagName('svg').style.display = 'block';
    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var colorRange = d3.scale.category20();
    var color = d3.scale.ordinal()
        .range(colorRange.range());

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));
    d3.select("#Chart").selectAll("*").remove();

    var divTooltip = d3.select("#Chart").append("div").attr("class", "toolTip");


    var svg = d3.select("#Chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


   /* dataset = [
        {label:"Full-Time", "Father":484.3420698417, "Mother":490.6479547794},
        {label:"Part-Time", "Father":432.9872822799, "Mother":478.5541082864},
        {label:"Not Working", "Father":434.6511085099, "Mother":427.1150138577},
        {label:"Other", "Father":449.450684796, "Mother":449.1022534554}
    ];
*/
    dataset = [
        {label:"HB-LL", "QUIC":0.869, "HTTP2":0.160},
        {label:"LB-HL", "QUIC":1.10, "HTTP2":0.55},
        {label:"HB-HL", "QUIC":0.963, "HTTP2":0.27},
        {label:"LB-LL", "QUIC":0.968, "HTTP2":0.99}
    ];


    var options = d3.keys(dataset[0]).filter(function (key) {
        return key !== "label";
    });

    dataset.forEach(function (d) {
        d.valores = options.map(function (name) {
            return {name: name, value: +d[name]};
        });
    });

    x0.domain(dataset.map(function (d) {
        return d.label;
    }));
    x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(dataset, function (d) {
        return d3.max(d.valores, function (d) {
            return d.value;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        //.text("Employment Type");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -170)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sum of Math Scores");

    var bar = svg.selectAll(".bar")
        .data(dataset)
        .enter().append("g")
        .attr("class", "rect")
        .attr("transform", function (d) {
            return "translate(" + x0(d.label) + ",0)";
        });

    bar.selectAll("rect")
        .data(function (d) {
            return d.valores;
        })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function (d) {
            return x1(d.name);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("value", function (d) {
            return d.name;
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    bar
        .on("mousemove", function (d) {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l - 1
            elementData = elements[l].__data__
            divTooltip.html((d.label) + "<br>" + elementData.name + "<br>" + elementData.value );
        });
    bar
        .on("mouseout", function (d) {
            divTooltip.style("display", "none");
        });


    var legend = svg.selectAll(".legend")
        .data(options.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });
