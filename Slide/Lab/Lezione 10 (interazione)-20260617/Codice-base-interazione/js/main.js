window.onload = main;

function main(){
    scatterplotBarchart();
    linechartBrush();
}


async function getDataCSV(path){
    const data = await d3.csv(path);
    //console.log(data);
    return data;
}

async function scatterplotBarchart(){
    const data = await getDataCSV('../datasets/trekking.csv');
    const idSVG = "scatterBarSVG";
    let processedData = data.map(d =>
        ({...d,
            time: +d.time,
            distance: +d.distance}))
    renderScatterplotBarchart(processedData, idSVG);
}
function renderScatterplotBarchart(data, idSVG){
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    // Divido l'SVG in due aree: scatterplot a sinistra e barchart a destra.
    const config = {
        marginSVG: {top: 50, right: 40, bottom: 40, left: 40},
        P:50,
        F:0.6
    }

    // Configurazione dello scatterplot.
    config.leftChart = {
        width: svgWidth * config.F,
        height: svgHeight,
        margin: {...config.marginSVG, right: config.P},
        origin: {x: 0, y: 0}
    }

    // Configurazione del barchart.
    config.rightChart = {
        width: svgWidth * (1 - config.F),
        height: svgHeight,
        margin: {...config.marginSVG, left: config.P},
        origin: {x: config.leftChart.width, y: 0}
    }

    scatterplot(data, config.leftChart, svg, ['distance', 'time']);
    barchart(data, config.rightChart, svg, 'ascending','difficulty');



}
function scatterplot(data, config, svg, keys){

    const chartWidth = config.width - config.margin.left - config.margin.right;
    const chartHeight = config.height - config.margin.top - config.margin.bottom;
    const [xKey, yKey] = keys;
    const gContainer = svg.append('g')
        .attr('transform', `translate(${config.margin.left + config.origin.x}, ${config.margin.top + config.origin.y})`)
        .attr('width', config.width)
        .attr('height', config.height)
        .classed('scatterplot', true)

    const scaleX = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xKey])])
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yKey])])
        .range([chartHeight, 0])
        .nice()

    // Creazione degli assi
    // x-axis
    gContainer.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .classed('x-axis', true)
        .call(
            d3.axisBottom(scaleX)
                .ticks(5)
                .tickFormat(d => d + ' km')
                .tickPadding(5)
        )
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(xKey);

    // y-axis
    gContainer.append("g")
        .classed('y-axis', true)
        .call(
            d3.axisLeft(scaleY)
                .tickSizeInner(-chartWidth)
                .tickPadding(10)
        )
        .append("text")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(yKey)

    // Styling delle griglie orizzontali
    gContainer.selectAll('.y-axis .tick line')
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "10,2")
        .attr("opacity", 0.8)

    // scatter points
    gContainer
        .append('g')
        .selectAll(null)
        .data(data)
        .join('circle')
        .attr('cx', d => scaleX(d[xKey]))
        .attr('cy', d => scaleY(d[yKey]))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')

    // INSERT CODE...

}
function barchart(data, config, svg, sort_bars, key){
    const chartWidth = config.width - config.margin.left - config.margin.right;
    const chartHeight = config.height - config.margin.top - config.margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${config.margin.left + config.origin.x}, ${config.margin.top + config.origin.y})`)
        .attr('width', config.width)
        .attr('height', config.height)
        .classed('barchart', true)


    const aggregatedDataMap =
        // Raggruppo i trail per difficulty e conto quante occorrenze ci sono per ogni gruppo.
        // Il risultato è un array di coppie
        d3.rollups(data, g => g.length, d => d[key]);

    // Ordino le barre in base al numero di trail, in ordine crescente o decrescente a seconda del valore di sort_bars.
    if (sort_bars === 'ascending')
        aggregatedDataMap
            .sort((a, b) => d3.ascending(a[1], b[1]));
    else if (sort_bars === 'descending')
        aggregatedDataMap
            .sort((a, b) => d3.descending(a[1], b[1]));

    // scale-x
    const scaleX = d3.scaleBand()
        .domain(aggregatedDataMap.map(d => d[0]))
        .range([0, chartWidth])
        .padding(0.1);

    // axis-x
    gContainer.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    //  scale-y
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(aggregatedDataMap, d => d[1])])
        .range([chartHeight, 0])
        .nice();

    // axis-y
    gContainer.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".2s")
            .tickSize(-chartWidth)
        )
        .append("text")
        .text("Trails")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')

    // Styling delle griglie orizzontali
    gContainer.selectAll('.y-axis .tick line')
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "10,2")
        .attr("opacity", 0.8)

    // Funzioni per posizionare e dimensionare le barre del barchart.
    const get_x = d => scaleX(d[0])
    const get_y = d => scaleY(d[1])
    const get_width = () => scaleX.bandwidth()
    const get_height = d => chartHeight - scaleY(d[1])

    // barre del barchart, colorate in base alla difficoltà tramite la scala scaleColorDifficulty.
    gContainer.append('g').classed("rects", true).selectAll('rect')
        .data(aggregatedDataMap)
        .join('rect')
        .attr('x', get_x)
        .attr('y', get_y)
        .attr('width', get_width)
        .attr('height', get_height)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')
        .append('title')
        .text(d => d3.format(".2s")(d[1]))
}


async function linechartBrush(){
    const data = await getDataCSV('../datasets/dummy.csv');
    const idSVG = "linechartsSVG";
    let processedData = data.map(d =>
        ({...d,
            Close: +d.Close,
            Time: d3.timeParse('%Y-%m-%d')(d.Time)}));

    renderLinechartBrush(processedData, idSVG);
}

function renderLinechartBrush(data, idSVG){
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    // Divido l'SVG in due aree: grafico principale sopra e area del brush sotto.
    const config = {
        marginSVG: {top: 50, right: 90, bottom: 40, left: 90},
        P: 40,
        F: 0.8
    }

    // Configurazione del grafico principale (line chart)
    config.topChart = {
        width: svgWidth,
        height: svgHeight * config.F,
        margin: {...config.marginSVG, bottom: config.P},
        origin: {x: 0, y: 0}
    }

    // Configurazione dell'area del brush
    config.bottomChart = {
        width: svgWidth,
        height: svgHeight * (1 - config.F),
        margin: {...config.marginSVG, top: config.P},
        origin: {x: 0, y: config.topChart.height}
    }

    linechart(svg, data, config.topChart, ['Time', 'Close'], true, 'main_chart');
    brush(svg, data, config.bottomChart);
}

function linechart(svg, data, config, keys, showYLabels, id){

    const [key1, key2] = keys;
    const chartWidth = config.width - config.margin.left - config.margin.right;
    const chartHeight = config.height - config.margin.top - config.margin.bottom;

    // Creo un container per il line chart, posizionato in base alla configurazione passata.
    const gContainer =  svg.append('g')
        .attr('transform', `translate(${config.margin.left + config.origin.x}, ${config.margin.top + config.origin.y})`)
        .attr('width', config.width)
        .attr('height', config.height)
        .attr('id', 'linechart')
        .classed('linechart', true)

    // Se viene passato un id, lo assegno al container del line chart per poterlo identificare facilmente in seguito
    // (es. per rimuoverlo quando si aggiorna la selezione del brush).
    if (id) {
        console.log('Aggiungo id del container a', id)
        gContainer.attr('id', id)
    }

    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d[key1]))
        .range([0, chartWidth])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d[key2]))
        .range([chartHeight, 0])
        .nice()

    // Creazione degli assi
    // x-axis
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("x", chartWidth)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text(key1);

    // y-axis
    gContainer.append("g")
        .classed('y-axis', true)
        .call(
            d3.axisLeft(scaleY)
                .tickSizeInner(-chartWidth)
                .tickPadding(10)
                // Se showYLabels è false, rimuovo le etichette degli assi y
                // impostando il numero di tick a 0, altrimenti lascio il numero di tick di default.
                .ticks(showYLabels ? null : 0)
        )
        .append("text")
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        .text(key2)

    // Styling delle griglie orizzontali
    gContainer.selectAll('.y-axis .tick line')
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "10,2")
        .attr("opacity", 0.8)

    // Line chart
    gContainer.append('path')
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => scaleX(d[key1]))
            .y(d => scaleY(d[key2]))
        )

    return scaleX;
}

function brush(svg, data, config){

    const chartWidth = config.width - config.margin.left - config.margin.right;
    const chartHeight = config.height - config.margin.top - config.margin.bottom;

    const translate = {
        x: config.margin.left + config.origin.x,
        y: config.margin.top + config.origin.y
    }
    // Il line chart del brush è più semplice, senza assi e senza etichette,
    // e serve solo per mostrare l'andamento generale dei dati e
    // permettere di selezionare un intervallo di tempo.
    const scaleX = linechart(svg, data, config, ['Time', 'Close'], false, 'brush_chart');



}



