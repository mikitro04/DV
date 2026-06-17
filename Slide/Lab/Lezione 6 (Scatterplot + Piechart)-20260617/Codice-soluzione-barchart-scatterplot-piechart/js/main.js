window.onload = main;

function main(){
    barchart();
    scatterplot();
    piechart();
}

async function getData(path){

    const data = await d3.csv(path)
    console.log(data)
    return data;
}

//BarChart
function renderBarChart(idSVG, data, sort){

    const svg = d3.select('#'+ idSVG);
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");

    const margin = {top: 40, right: 40, bottom: 40, left: 80};
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    if (sort)
        data.sort((a, b) => d3.ascending(a['population'], b['population']))


    const scaleX = d3.scaleBand()
        .domain(data.map(d => d['name']))
        .range([0, chartWidth])
        .padding(0.3);

    //asse x
    gContainer.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX))

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['population'])])
        .range([chartHeight, 0])
        .nice()

    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".3s")
            .tickSize(-chartWidth)
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey')
            .attr('stroke-dasharray', '10, 2'))

    const getX = d => scaleX(d['name']);
    const getY = d => scaleY(d['population']);
    const getWidth = d => scaleX.bandwidth()
    const getHeight = d => chartHeight - scaleY(d['population']);

    const onMouseover = (event, d) => {
        d3.select(event.currentTarget)
            .attr('fill', 'orange')
            .append('title')
            .text(d => d3.format(".3s")(d['population']))
    };


    const onMouseout = function () {
        d3.select(this)
            .attr('fill', 'steelblue')
    };

    gContainer.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', getX)
        .attr('y', getY)
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('fill', 'steelblue')
        .on("mouseover", onMouseover)
        .on("mouseout", onMouseout)

}
async function barchart(){
    let data = await getData("./datasets/barchart_data.csv")
    const idSVG = "barchartSVG";
    const sort = true;

    let processedData = data.map(row => ({
        ...row,
        'population': +row['population']
    }))

    renderBarChart(idSVG, processedData, sort);

}

//ScatterPlot
function renderScatterPlot(idSVG, data){

    const svg = d3.select(`#${idSVG}`)
    const svgWidth = svg.attr('width');
    const svgHeight = svg.attr('height');

    const margin = {top: 40, right: 60, bottom: 40, left: 60}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const scaleX = d3.scaleLinear()
        .domain(d3.extent(data, d => d['age']))
        .range([0, chartWidth])

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d['charges']))
        .range([chartHeight, 0])
        .nice()

    const gContainer = svg.append('g')
        .attr('id', 'gContainer')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    //Asse x
    gContainer.append('g')
        .attr('transform', `translate(0,  ${chartHeight})`)
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("fill", "black")
        .attr("x", chartWidth)
        .attr("y", "-5px")
        .attr("text-anchor", "start")
        .attr("dominant-baseline", 'text-after-edge')
        .text('Age')

    //Asse y
    gContainer.append('g')
        .call(d3.axisLeft(scaleY))
        .append("text")
        .attr("fill", "black")
        .attr("x", 0)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", 'text-after-edge')
        .text('Charges')

    //Plot del grafico
    const handleX = (d) => scaleX(d['age'])
    const handleY = (d) => scaleY(d['charges'])

    gContainer
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', handleX)
        .attr('cy', handleY)
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('r', 3)

}

async function scatterplot(){

    let data = await getData('../datasets/insurance.csv')
    //console.log(data)
    let processedData = data.map(row => ({
        ...row,
        'age': +row['age'],
        'bmi': +row['bmi'],
        'charges': +row['charges'],
        'children': +row['children'],
    }))

    let idSVG = 'scatterplotSVG'
    renderScatterPlot(idSVG, processedData);
}


function createLegend(container, arcs, get_color, normalizedValueStr, dimensions) {
    const rect_sizes = {width: 20, height: 20, x: 0, y: 0};
    const font_size = 18;
    const [chartWidth, margin] = dimensions;

    //categoria: valore%
    const arc2text = d =>
        `${d.data[0]}: ${normalizedValueStr(d.data[1])}`;

    const longestText =
        d3.max(arcs.map(arc2text), d => d.length)

    const legend = container
        .append('g')
        .attr('id', 'legend')
        .attr('transform',
            `translate(${chartWidth-margin.right-longestText}, ${margin.top})`);

    legend.append('text')
        .text('Legend')
        .attr('x', rect_sizes.x)
        .attr('y', -rect_sizes.height * 1.5)
        .attr('fill', 'black')
        .style('font-size', font_size)
        .attr('dominant-baseline', 'hanging')

    const legendGroups = legend.selectAll('g')
        .data(arcs)
        .join('g')
        .attr('class', d => d.data[0])
        .attr('transform', (d, i) =>
            `translate(0, ${i * 2 * rect_sizes.height})`)
        .on('mouseover', function(evt, d){

            d3.select(this)
                .classed('hovered', true);

            d3.select(`#circleGroup path.${d.data[0]}`)
                .classed('hovered', true);
        })
        .on('mouseout', function(evt, d){
            d3.select(this)
                .classed('hovered', false);

            d3.select(`#circleGroup path.${d.data[0]}`)
                .classed('hovered', false);
        })

    legendGroups
        .append('rect')
        .attr('x', rect_sizes.x)
        .attr('y', rect_sizes.y)
        .attr('width', rect_sizes.width)
        .attr('height', rect_sizes.height)
        .attr('fill', get_color);



    legendGroups
        .append('text')
        .text(arc2text)
        .attr('x', rect_sizes.width * 1.5)
        .attr('fill', 'black')
        .style('font-size', font_size)
        .attr('dominant-baseline', 'hanging');
}

function renderPiechart(idSVG, dataTupla){

    const [data, normalizedValueStr] = dataTupla;
    //Recupero l'SVG e le sue dimensioni
    const svg = d3.select('#' + idSVG)
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");

    //Calcolo le dimensioni del grafico dati questi margini
    const margin = {top: 40, right: 40, bottom: 40, left: 40}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    let arcs, get_color;

    //Imposto i raggi del Pie Chart
    //dal centro al buco
    const innerRadius = 100;

    //dal centro al bordo esterno
    //metà del lato più piccolo - il margine più grande per lasciare spazio
    const outerRadius = Math.min(chartWidth, chartHeight) / 2
        - Math.max(...Object.values(margin));

    // Crea il gruppo principale del grafico centrato
    const group = svg.append('g')
        .attr('transform', `translate(${margin.left + chartWidth / 2}, 
            ${margin.top + chartHeight / 2})`)
        .attr('id', 'circleGroup');

    // Crea una scala di colori per gli spicchi
    const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeTableau10);

    // Calcola gli angoli di ogni sezione del grafico
    const pie = d3.pie().value(d => d[1]);
    arcs = pie(Object.entries(data));

    // Crea i percorsi (path) per ogni arco
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
        .style("opacity", 0.7)
        .on('mouseover', function(evt, d){
            d3.select(this)
                .classed('hovered', true);
            d3.select(`#legend g.${d.data[0]}`)
                .classed('hovered', true);
        })
        .on('mouseout', function(evt, d){
            d3.select(this)
                .classed('hovered', false);
            d3.select(`#legend g.${d.data[0]}`)
                .classed('hovered', false);

        })


    group.selectAll('circle')
        .data(arcs)
        .join('circle')
        .attr('cx', d => arcGenerator.centroid(d)[0])
        .attr('cy', d => arcGenerator.centroid(d)[1])
        .attr('r', 5);

    group.selectAll('text')
        .data(arcs)
        .join('text')
        .text(d => normalizedValueStr(d.data[1]))
        .attr('x', d => arcGenerator.centroid(d)[0])
        .attr('y', d => arcGenerator.centroid(d)[1])
        .attr('dx', d => d.startAngle < Math.PI? "0.5em": "-0.5em")
        .attr('dy', '-0.5em')
        .style('text-anchor',
            d => d.startAngle < Math.PI? "start": "end")
        .style('font-size', '17px')


    get_color = (d, i) => {
        const [group, value] = d.data;
        return color(group)
    }

    createLegend(svg, arcs, get_color, normalizedValueStr,[chartWidth, margin])
}

function piechart(){

    let data = {a: 9, b: 20, c: 7, d: 30, e: 12};

    // Calcola la somma totale dei valori
    const sumValues = d3.sum(Object.values(data));

    // Normalizza i valori in percentuale
    // 9 : 78 = x : 100
    const normalizedValue = v => d3.format(".2s")(v * 100 / sumValues);
    const normalizedValueStr = v => `${normalizedValue(v)}%`;
    renderPiechart('piechartSVG', [data, normalizedValueStr])

}