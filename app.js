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

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var state = data.state;
      var abbr = data.abbr;
      var poverty = +data.poverty;
      var other = +data.other;
      return (
        state + '<br> do not own or rent: ' + other + '<br> poverty level: ' + poverty 
      );
    });

  chart.call(toolTip);

  chart
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.poverty);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.other);
    })
    .attr('r', '7')
    .attr('fill', 'lightblue')
    // .append("text") //Add a text element
    // .text(function(d, i){return 'test';})
    //   /* Create the text for each block */
     
    .on('click', function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
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
});

var Cirles = svg.selectAll('circle')
.enter()
.append('text').text('data.abbr');
