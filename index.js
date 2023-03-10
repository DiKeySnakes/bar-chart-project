let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select('svg');

const generateSvg = () => {
  svg.attr('width', width);
  svg.attr('height', height);
};

const generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  let datesArray = values.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([height - padding, padding]);
};

const generateBars = () => {
  const tooltip = d3.select('body').append('div').attr('id', 'tooltip');

  svg
    .selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width - 2 * padding) / values.length)
    .attr('data-date', (item) => {
      return item[0];
    })
    .attr('data-gdp', (item) => {
      return item[1];
    })
    .attr('height', (item) => {
      return heightScale(item[1]);
    })
    .attr('x', (item, index) => {
      return xScale(index);
    })
    .attr('y', (item) => {
      return height - padding - heightScale(item[1]);
    })
    .on('mouseover', (e) => {
      const target = e.target;
      tooltip.transition().style('visibility', 'visible');

      tooltip.text(
        target.dataset.date + ' $' + target.dataset.gdp + ' Billion'
      );

      document
        .querySelector('#tooltip')
        .setAttribute('data-date', target.dataset.date);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

const generateAxes = () => {
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - padding) + ')');

  svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)');
};

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const req = new XMLHttpRequest();

req.open('GET', url, true);
req.send();
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  generateSvg();
  generateScales();
  generateBars();
  generateAxes();
};
