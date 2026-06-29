window.onload = main;

function main(){
    // Avvio le due visualizzazioni della pagina.
    scatterplotBarchart();
    linechartBrush();
}


async function getDataCSV(path){
    return await d3.csv(path);
    //console.log(data);
}
async function scatterplotBarchart(){
    const data = await getDataCSV('./datasets/trekking.csv');
    const idSVG = "scatterBarSVG";
    // Converto i campi numerici prima del rendering.
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

    // Stato condiviso del filtro sulle difficoltà e palette colori dedicata.
    let difficultyFilter = ["Easy", "Intermediate", "Difficult"];

    // Creazione scale color custom per le difficoltà
    const scaleColorDifficulty = d3.scaleOrdinal()
        .domain(difficultyFilter)
        .range(["#29CD29", "#CDCD29", "#FF2929"])

    scatterplot(data, config.leftChart, svg, ['distance', 'time'], scaleColorDifficulty);
    barchart(data, config.rightChart, svg, 'ascending', 'difficulty', scaleColorDifficulty);


    // Funzione di gestione del click sulle barre del barchart.
    const onClickDifficulty = function (event, d){
        // Si verifica se la difficoltà associata alla barra cliccata è già presente nel filtro.
        const isBarFiltered = difficultyFilter.includes(d[0]);
        // Se è già presente, significa che vogliamo rimuoverla dal filtro (escluderla dallo scatterplot),
        // altrimenti la aggiungiamo.
        if (isBarFiltered) {
            difficultyFilter = difficultyFilter.filter(el => el !== d[0]);
        }
        else {
            difficultyFilter.push(d[0]);
        }
        // Aggiorno lo stile della barra cliccata per riflettere se è attiva o meno nel filtro.
        // Se la barra è attiva (inclusa nel filtro),
        // ha un bordo nero e piena opacità, altrimenti è più trasparente e senza bordo.
        d3.select(this)
            .classed('clicked', difficultyFilter.includes(d[0]))
            .attr('stroke-width', (d) => difficultyFilter.includes(d[0])? '2px': '0px')
            .attr('stroke', (d) => difficultyFilter.includes(d[0])? 'black' : 'none')
            .attr('opacity', (d) => difficultyFilter.includes(d[0])? '1' : '0.7')

        // Dopo aver aggiornato il filtro, si filtra il dataset originale
        // per includere solo i percorsi che corrispondono alle difficoltà attualmente selezionate.
        const filteredData = data.filter(d => difficultyFilter.includes(d.difficulty));
        // Infine, si ridisegna lo scatterplot con i dati filtrati, mostrando solo i percorsi delle difficoltà selezionate.
        updateRenderScatterplot(filteredData, config.leftChart, svg, keys = ['distance', 'time'], scaleColorDifficulty);
    }

    // Associo la funzione di click a tutte le barre del barchart.
    d3.selectAll('.barchart .rects rect')
        .on('click', onClickDifficulty)


    // Gestisco il cambio di ordinamento tramite i radio button.
    d3.selectAll('input[name="sortOption"]').on('change', function(){
        // Il cambio radio ricrea la barchart con il nuovo ordinamento.
        let currentOrder = this.value;
        d3.select('.barchart').remove();
        barchart(data, config.rightChart, svg, currentOrder, 'difficulty', scaleColorDifficulty);
        d3.selectAll('.barchart .rects rect')
            .on('click', onClickDifficulty)
    });



}


function updateRenderScatterplot(data, config, svg, keys, scaleColorDifficulty){
    d3.select('svg > g.scatterplot').remove()
    scatterplot(data, config, svg, keys, scaleColorDifficulty);
}



function scatterplot(data, config, svg, keys, scaleColorDifficulty){

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


    // prima versione con cerchi semplici
    //scatter points
    /*
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
     */

    // TODO: in più
    // Mostrare il contenuto dello scatterplot con o senza simboli in base al flag useSymbols
    // https://d3js.org/d3-shape/symbol
    // Con `useSymbols` decido se usare forme diverse per difficulty o semplici cerchi.
    const useSymbols = true;
    if (useSymbols) {
        // Se uso simboli, definisco una scala apposita per associare una forma a ogni categoria di difficoltà.
        const scaleSymbols = d3.scaleOrdinal()
            .domain(["Easy", "Intermediate", "Difficult"])
            .range([
                d3.symbol().type(d3.symbolCircle),
                d3.symbol().type(d3.symbolSquare),
                d3.symbol().type(d3.symbolDiamond)
            ])
        // Creo i simboli con la forma e il colore corrispondente alla difficoltà.
        gContainer.append('g')
            .classed('circles', true)
            .selectAll(null)
            .data(data)
            .join('path')
            .attr('class', 'symbol')
            .attr('transform',
                d => `translate(${scaleX(d[xKey])}, ${scaleY(d[yKey])})`)
            .attr('d', d => scaleSymbols(d.difficulty)())
            .attr("fill", d => scaleColorDifficulty(d.difficulty))

    } else {
        // Se non uso simboli, mostro semplici cerchi colorati in base alla difficoltà.
        gContainer.append("g")
            .selectAll(null)
            .data(data)
            .join("circle")
            .attr("cx", d => scaleX(d[xKey]))
            .attr("cy", d => scaleY(d[yKey]))
            .attr("r", 5)
            .attr("fill", d => scaleColorDifficulty(d.difficulty))
            .attr('stroke', 'black')
    }

}
function barchart(data, config, svg, sort_bars, key, scaleColorDifficulty){
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
        .attr('fill', d => scaleColorDifficulty(d[0]))
        .attr('stroke', 'black')
        .append('title')
        .text(d => d3.format(".2s")(d[1]))

}

async function linechartBrush(){
    const data = await getDataCSV('./datasets/dummy.csv');
    const idSVG = "linechartsSVG";
    // Parsing dei dati temporali e numerici per il line chart.
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

    // Funzione di callback che viene chiamata ogni volta che cambia la selezione del brush.
    function update_chart(x0, x1) {
        // Se non c'è selezione, non modifico il grafico principale.
        const isClickWithoutSelection = x0 === null && x1 === null
        if (isClickWithoutSelection) {
            return
        }

        // Filtra i dati nel range selezionato e ridisegna il grafico sopra.
        const filtered_data = data.filter(d => d.Time >= x0 && d.Time <= x1)
        // Rimuovo il grafico precedente prima di ridisegnare quello aggiornato.
        d3.select('svg > g#main_chart').remove()
        linechart(svg, filtered_data, config.topChart, ['Time', 'Close'], true, 'main_chart');
    }
    // Creo il grafico del brush, passando la funzione di callback che aggiorna
    // il grafico principale quando cambia la selezione.
    brush(svg, data, config.bottomChart, update_chart);




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

                // showYLabels sarà true per il line chart principale e false per il line chart del brush,
                // in modo da non sovraccaricare visivamente l'area del brush con troppe etichette.
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
function brush(svg, data, config, callback){

    const chartWidth = config.width - config.margin.left - config.margin.right;
    const chartHeight = config.height - config.margin.top - config.margin.bottom;

    // Il line chart del brush è più semplice, senza assi e senza etichette,
    // e serve solo per mostrare l'andamento generale dei dati e
    // permettere di selezionare un intervallo di tempo.
    const scaleX = linechart(svg, data, config, ['Time', 'Close'], false, 'brush_chart');

    // Calcolo le coordinate dell'area del brush
    // in modo da posizionarlo correttamente sotto il grafico principale.
    const translate = {
        x: config.margin.left + config.origin.x,
        y: config.margin.top + config.origin.y
    }

    // Le coordinate dell'area del brush sono definite dai punti in alto a sinistra e in basso a destra,
    const B = {
        topLeftCorner: [translate.x, translate.y],
        bottomRightCorner: [translate.x + chartWidth, translate.y + chartHeight]
    }


    // Il brush lavora sull'area del grafico inferiore.
    const brush = d3.brushX()
        .extent([B.topLeftCorner,B.bottomRightCorner])
        // Ogni volta che cambia la selezione del brush,
        // viene chiamata la funzione OnBrushSelectionChange,
        // che converte le coordinate della selezione in un intervallo
        // di tempo e chiama la callback per aggiornare il grafico principale.
        .on("brush end", (e, _) => OnBrushSelectionChange(e, callback, scaleX, translate))

    // Aggiungo il brush all'SVG, associandolo al gruppo dedicato e chiamando la funzione brush per attivarlo.
    svg
        .append('g')
        .classed('brush-g',true)
        .call(brush)

}

function  OnBrushSelectionChange(event, callback, scaleX, translate) {

    // L'area di selezione del brush è definita
    // da due coordinate (x0, x1) che rappresentano
    // i pixel in cui è stata fatta la selezione.

    const area = event.selection;

    // Se non c'è selezione, passo null alla callback
    // per indicare che non c'è filtro da applicare al grafico principale.
    if (!area) {callback(null, null); return}

    // Se c'è una selezione, converto le coordinate pixel
    // in valori temporali usando la scala del grafico del brush.
    const [f_x0, f_x1] = [area[0] - translate.x, area[1] - translate.x]
    const [x0, x1] = [scaleX.invert(f_x0), scaleX.invert(f_x1)]

    // Passo l'intervallo filtrato al grafico principale.
    callback(x0, x1)
}



