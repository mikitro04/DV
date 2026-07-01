window.onload = main;

function main() {
    const data = get_data();
    render_data(data);
}

function get_data() {
    return {a: 42, b: 20, c: 25, d: 30, e: 12};
}


// Dimensioni dell'SVG
const svgWidth = 900;
const svgHeight = 650;

// Margini interni del grafico
const margin = {top: 40, right: 40, bottom: 40, left: 40};
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

function render_data(data) {
    console.log("DATA", data);

    const innerRadius = 0;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2
        - Math.max(...Object.values(margin));

    const svg = d3.select("body")
        .append("svg")
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const group = svg.append('g')
        .attr('transform', `translate(${margin.left + chartWidth / 2}, 
            ${margin.top + chartHeight / 2})`)
        .attr('id', 'circleGroup');

    const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeTableau10);

    const pie = d3.pie().value(d => d[1]);
    const arcs = pie(Object.entries(data));

    const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    group.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .attr("class", d => d.data[0])
        .style("stroke-width", "2px")
        .style("opacity", 0.8)

}
