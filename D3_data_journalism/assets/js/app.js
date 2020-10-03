// @TODO: YOUR CODE HERE!
// 1. create the svgGroup 

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// // 2. data parameters

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// a. function used for updating x-scale and y-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);
  return xLinearScale;
}

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.9,
      d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);
  return yLinearScale;
}


// b. function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// c. function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale,newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}


// // d. function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//   var xlabel, ylabel;

//   if (chosenXAxis === "poverty") {
//     xlabel = "Poverty:";
//   } else if (chosenXAxis === 'age') {
//     xlabel = "Poverty:";
//   } else if (chosenXAxis === 'income'){
//     xlabel = "Income";
//   };

//   if (chosenYAxis === "healthcare") {
//     ylabel = "Healthcare:";
//   } else if (chosenYAxis === 'smokes') {
//     ylabel = "Smokes:";
//   } else if (chosenYAxis === 'obesity'){
//     ylabel = "Obesity";
//   };

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(info) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(info, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// };

// !!!!!!!!!!!!!!!!!!! no hovering 
// !!!!!!!!!!!!!!!!!!! no abbr for circle


// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(data, err) {
  if (err) throw err;
  console.log(data);
  // parse data
  data.forEach(function(state) {
    state.abbr = +state.abbr;
    // y axis
    state.smokes = +state.smokes;
    state.obesity = +state.obesity;
    state.healthcare = +state.healthcare;
    // x axis
    state.poverty = +state.poverty;
    state.age = +state.age
    state.income = +state.income;
  });
  
  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);


  // // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 13)
    .attr("fill", "#ADD8E6")
    .attr("opacity", "1");

  // var statesGroup = chartGroup.selectAll("text")
  //   .data(data)
  //   .enter()
  //   .append("text")
  //   .attr("x", d => xLinearScale(d[chosenXAxis]-13*0.1))
  //   .attr("y", d => yLinearScale(d.healthcare)-13*0.1)
  //   .text(d => d.abbr);

  // Create group for three x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("id", "xText")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");

  var ageLabel = labelsGroup.append("text")
    .attr("id", "xText")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("id", "xText")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  var healthcareLabel = chartGroup.append("text")
    .attr("id", "yText")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare") 
    .classed("active", true)
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

    var smokesLabel = chartGroup.append("text")
    .attr("id", "yText")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes") 
    .classed("inactive", true)
    .classed("axis-text", true)
    .text("Smokes");

    var obesityLabel = chartGroup.append("text")
    .attr("id", "yText")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity") 
    .classed("inactive", true)
    .classed("axis-text", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  var yvalue = 'healthcare';
  var xvalue = 'poverty';

  labelsGroup.selectAll("#xText")
    .on("click", function() {
      var newXValue = d3.select(this).attr("value");
      chosenXAxis = newXValue;
      console.log("clickx",chosenXAxis);
      console.log("noclicky",chosenYAxis);
      updateAxis();
  });

  chartGroup.selectAll("#yText")
    .on("click", function() {
      var newYvalue = d3.select(this).attr("value");
      chosenYAxis = newYvalue;
      console.log("clicky",chosenYAxis);
      console.log("noclickx",chosenXAxis);
      updateAxis();
  });

  // function to updata axis scales and information after clicking
  function updateAxis() {
  // functions here found above csv import
  // updates x scale for new data
  xLinearScale = xScale(data, chosenXAxis);
  yLinearScale = yScale(data, chosenYAxis);

  // updates x axis with transition
  xAxis = renderXAxes(xLinearScale, xAxis);
  yAxis = renderYAxes(yLinearScale, yAxis);

  // updates circles with new x values
  circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis, choseeYAxis, circlesGroup);

  // changes classes to change bold text
  // x - axis
  if (chosenXAxis === "poverty") {
    povertyLabel
      .classed("active", true)
      .classed("inactive", false);
    ageLabel
      .classed("active", false)
      .classed("inactive", true);
    incomeLabel
    .classed("active", false)
    .classed("inactive", true);
  } else if (chosenXAxis === "age"){
    ageLabel
      .classed("active", true)
      .classed("inactive", false);
    povertyLabel
      .classed("active", false)
      .classed("inactive", true);
    incomeLabel
    .classed("active", false)
    .classed("inactive", true);
  } else if (chosenXAxis === "income"){
    incomeLabel
      .classed("active", true)
      .classed("inactive", false);
    povertyLabel
      .classed("active", false)
      .classed("inactive", true);
    ageLabel
    .classed("active", false)
    .classed("inactive", true);
  };

  // y - axis
  if (chosenYAxis === "healthcare") {
    healthcareLabel
      .classed("active", true)
      .classed("inactive", false);
    smokesLabel
      .classed("active", false)
      .classed("inactive", true);
    obesityLabel
    .classed("active", false)
    .classed("inactive", true);
  } else if (chosenYAxis === "smokes"){
    smokesLabel
      .classed("active", true)
      .classed("inactive", false);
    healthcareLabel
      .classed("active", false)
      .classed("inactive", true);
    obesityLabel
    .classed("active", false)
    .classed("inactive", true);
  } else if (chosenYAxis === "obesity"){
    obesityLabel
      .classed("active", true)
      .classed("inactive", false);
    smokesLabel
      .classed("active", false)
      .classed("inactive", true);
    healthcareLabel
    .classed("active", false)
    .classed("inactive", true);
  };
  }; // the updateAxis function curly presis 
}).catch(function(error) {
  console.log(error);
});
