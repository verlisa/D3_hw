var svgWidth = 960;
var svgHeight = 450;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.csv('data.csv', function(err, data) {
  if (err) throw err;

  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.other = +data.other;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    8,
    d3.max(data, function(data) {
      return +data.poverty * 0.6;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(data, function(data) {
      return +data.other * 1.0;
    }),
  ]);

  chart
    .selectAll('g')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.poverty);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.other);
    })
    .attr('r', '10')
    .attr('fill', 'lightblue')
    .attr('text-anchor', "middle")
 
  chart
    .selectAll('g')
    .data(data)
    .enter()
    .append('text')
    .text(function(data) {
      console.log(data.abbr);
      return data.abbr;
    })
    .attr('font-size',10)
    .attr('class', 'stateText')
    .attr('dx', function(data, index) {
      return xLinearScale(data.poverty) - 7;
    })
    .attr('dy', function(data, index) {
      return yLinearScale(data.other) + 3;
    })
    .attr('fill', 'white')
   
    

    var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var state = data.state;
      var other = +data.other;
      var poverty = +data.poverty;
      return (
        state + '<br> Does Not Own Or Rent: ' + other + '<br> Poverty: ' + poverty
      );
    });
 
  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

    // Append y-axis labels
  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Does Not Rent or Own Housing');

  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('In Poverty (%)');

    function drawLabels(chartInternal) {
      var textLayers = chartInternal.main.selectAll('.' + c3.chart.internal.fn.CLASS.texts);
      for (var i = 0; i < textLayers[0].length; i++) {
          // select each of the scatter points
          chartInternal.mainCircle[i].forEach(function (circle, index) {
              var d3point = d3.select(circle)
              d3.select(textLayers[0][i])
                  .append('text')
                  // center horizontally and vertically
                  .style('text-anchor', 'middle').attr('dy', '.3em')
                  .text(i + '.' + index)
                  // same as at the point
                  .attr('x', d3point.attr('cx')).attr('y', d3point.attr('cy'))
          })
      }
  }
  drawLabels(chart.internal);
  });

