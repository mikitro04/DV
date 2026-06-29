window.onload = main;

async function main() {
    let rawData = await d3.csv("./datasets/Trekking.csv");

    let data = rawData.map(row => ({
        ...row,
        'tempo': +row['tempo'],
        'distanza': +row['distanza'],
        'difficolta': row['difficolta'].trim()
    }));

    renderBarChart("barchartSVG", data);
    renderScatterPlot("scatterplotSVG", data);
}

// BAR CHART
function renderBarChart(idSVG, data) {
    const svg = d3.select('#' + idSVG);
    const chartWidth = svg.attr("width") - 120;
    const chartHeight = svg.attr("height") - 80;

    const counts = d3.rollup(data, v => v.length, d => d.difficolta);
    const chartData = ["Facile", "Media", "Difficile"].map(key => ({
        key: key,
        value: counts.get(key) || 0
    }));

    const g = svg.append('g').attr('transform', 'translate(60, 40)');

    const scaleX = d3.scaleBand().domain(chartData.map(d => d.key)).range([0, chartWidth]).padding(0.3);
    const scaleY = d3.scaleLinear().domain([0, d3.max(chartData, d => d.value)]).range([chartHeight, 0]).nice();

    g.append('g').attr("transform", `translate(0, ${chartHeight})`).call(d3.axisBottom(scaleX));
    g.append('g').call(d3.axisLeft(scaleY).ticks(5));

    g.selectAll('rect')
        .data(chartData)
        .join('rect')
        .attr('x', d => scaleX(d.key))
        .attr('y', d => scaleY(d.value))
        .attr('width', scaleX.bandwidth())
        .attr('height', d => chartHeight - scaleY(d.value))
        .attr('fill', d => d.key === "Facile" ? "green" : d.key === "Media" ? "yellow" : "red")
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget).attr('stroke', 'black').attr('stroke-width', '3px');
            d3.selectAll('#scatterplotSVG .item').style('opacity', p => p.difficolta === d.key ? 1 : 0.1);
        })
        .on('mouseout', (event, d) => {
            d3.select(event.currentTarget).attr('stroke', 'none');
            d3.selectAll('#scatterplotSVG .item').style('opacity', 1);
        });
}

// SCATTER PLOT
function renderScatterPlot(idSVG, data) {
    const svg = d3.select('#' + idSVG);
    const chartWidth = svg.attr("width") - 120;
    const chartHeight = svg.attr("height") - 80;

    const scaleX = d3.scaleLinear().domain([0, d3.max(data, d => d.distanza)]).range([0, chartWidth]);
    const scaleY = d3.scaleLinear().domain([0, d3.max(data, d => d.tempo)]).range([chartHeight, 0]);
    const scaleColor = d3.scaleOrdinal().domain(["Facile", "Media", "Difficile"]).range(["green", "yellow", "red"]);

    const g = svg.append('g').attr('transform', 'translate(60, 40)');

    g.append("g").attr("transform", `translate(0, ${chartHeight})`).call(d3.axisBottom(scaleX));
    g.append("g").call(d3.axisLeft(scaleY));

    const paths = g.selectAll('.item')
        .data(data)
        .join('path')
        .attr('class', 'item')
        .attr('transform', d => `translate(${scaleX(d.distanza)}, ${scaleY(d.tempo)})`)
        .attr('fill', d => scaleColor(d.difficolta))
        .attr('stroke', 'black')
        .attr('d', d3.symbol().type(d3.symbolCircle).size(100));

    paths.append('title').text(d => `${d.difficolta}: ${d.distanza}km in ${d.tempo}h`);

    // Interattività
    paths.on('mouseover', (event, d) => {
        g.selectAll('.item').style('opacity', p => p.difficolta === d.difficolta ? 1 : 0.1);
        d3.selectAll('#barchartSVG rect').style('opacity', p => p.key === d.difficolta ? 1 : 0.1);
    })
        .on('mouseout', () => {
            g.selectAll('.item').style('opacity', 1);
            d3.selectAll('#barchartSVG rect').style('opacity', 1);
        });

    d3.selectAll('input[name="shape"]').on('change', function() {
        const shapeType = this.value;
        paths.transition().duration(500).attr('d', d => {
            const type = (shapeType === 'circle') ? d3.symbolCircle : d3.symbolSquare;
            return d3.symbol().type(type).size(100)();
        });
    });
}