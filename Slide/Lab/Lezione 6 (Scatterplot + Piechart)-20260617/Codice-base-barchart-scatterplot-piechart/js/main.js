window.onload = main;

async function main(){
    barchart();
    scatterplot();
    piechart();
}

async function getData(path){
    const data = await d3.csv(path)
    console.log(data)
    return data;
}

async function preprocessData(data) {
    //restituisci i dati processati
    return data.map(row => ({
        ...row,
        'name': row['name'],
        'population': +row['population']
    }))
}

//BarChart
async function barchart(){
    let data = await getData("./datasets/barchart_data.csv")
    const idSVG = "barchartSVG";
    const sort = true;

    //processData
    let processedData = await preprocessData(data);

    renderBarChart(idSVG, processedData, sort);
}

function renderBarChart(idSVG, data, sort){
    const svg = d3.select('#' + idSVG);
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");

    const margin = {top: 40, right: 40, bottom: 40, left: 80};
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    if (sort) {
        data.sort((a, b) => d3.ascending(a['population'], b['population']))
    }

    //Associamo a ogni città una banda lungo l'asse x
    const scaleX = d3.scaleBand()
        .domain(data.map(d => d["name"]))
        .range([0, chartWidth])
        .padding(0.3);      // Distanza tra le barre

    //Asse X con i nomi delle città
    gContainer.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(scaleX));

    //Mappiamo la popolazione sull'asse y
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['population'])])
        .range([chartHeight, 0])
        .nice();

    //Asse y avrà i valori della popolazione e delle linee orizzontali
    gContainer.append('g')
        .call(d3.axisLeft(scaleY)
            .ticks(null, ".2s") //formatta i numeri notazione scientifica
            .tickSize(-chartWidth) //crea linee orizzontali da sinistra
        )
        .call(g => g.selectAll('line')
            .attr('stroke', 'lightgrey') //cambia il colore delle linee
            .attr('stroke-dasharray', '10, 2') //le rende tratteggiate
        );

    //Funzioni per calcolare la dimensione e il posizionamento delle barre
    //Dato un valore ci deve restituire le coordinate x, y,
    //la larghezza della barra(fissa) e l'altezza della barra in base
    //al valore della popolazione
    const getX = d => scaleX(d['name'])
    const getY = d => scaleY(d['population'])
    const getWidth = d => scaleX.bandwidth()
    const getHeight = d => chartHeight - scaleY(d['population'])

    const onMouseover = (event, d) => {
        d3.select(event.currentTarget)
            .attr('fill', 'orange')
            .attr("stroke", "black")
            .attr('stroke-width', '3px')
            // Label che comapre
            .append('title')
            .text(d => d3.format(".3s")(d['population']))
    }

    const onMouseout = function (event, d) {
        d3.select(this)
            .attr('stroke', 'none')
            .attr('fill', 'steelblue')
    }

    // Creiamo le barre come rettangoli
    gContainer.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', getX)
        .attr('y', getY)
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('fill', 'steelblue')
        .on('mouseover', onMouseover)
        .on('mouseout', onMouseout)
}

//ScatterPlot
async function scatterplot(){

    let data = await getData('./datasets/insurance.csv')
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

function renderScatterPlot(idSVG, data){
    const svg = d3.select('#'+idSVG)
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

    // Nuova scala per calcolare il raggio in base al BMI
    const scaleR = d3.scalePow()
        .exponent(6)                               // Esponente potenza
        .domain(d3.extent(data, d => d['bmi']))    // Minimo e massimo valore di BMI nel dataset
        .range([3, 20]);                           // Raggio minimo 3px, raggio massimo 20px
    // Handle per attribuire la dimensione dei cerchi dinamicamente in base al 'bmi'
    const handleR = (d) => scaleR(d['bmi'])

    const gContainer = svg.append('g')
        .attr('id', 'gContainer')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    /* --- ASSI DI RIFERIMENTO --- */
    const age_var = 'age';
    const charges_var = 'charges';

    // Asse X
    gContainer.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(scaleX))
        .append("text")
        .attr("fill", "black")
        .attr("x", chartWidth)
        .attr("y", "-5px")
        .attr("text-anchor", "start")
        .attr('dominant-baseline', 'text-after-edge')
        //.attr("font-weight", "bold")        // Grassetto
        .text(age_var.toUpperCase())        // Nome dell'asse

    // Asse Y
    gContainer.append("g")
        .call(d3.axisLeft(scaleY)/*.ticks(5)*/.tickFormat(d3.format(".3s")))      // Per cambiare la visualizzazione dei dati nell'asse (o ~s per tagliare gli zeri)
        // Add the label
        .append("text")
        .attr("fill", "black")
        .attr('x', 0)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr('dominant-baseline', 'text-after-edge')
        //.attr("font-weight", "bold")            // Grassetto
        .text(charges_var.toUpperCase())        // Nome dell'asse

    // .ticks(5) indica che nell'asse ci saranno circa 5 valori
    // Altrimenti .tickValues([x, y, ...]) per averli fissati da noi

    //Plot del grafico
    const handleX = (d) => scaleX(d['age'])
    const handleY = (d) => scaleY(d['charges'])

    // Indicatore del fumatore "yes" in rosso e "no" in verde
    const scaleColor = d3.scaleOrdinal()
        .domain(["yes", "no"])
        .range(["red", "green"]);

    // Funzioni per i cerchi per vedere il valore 'bmi' con il puntatore
    const onMouseover = (event, d) => {
        d3.select(event.currentTarget)
            .attr('fill', 'orange')
            .attr("stroke", "black")
            .attr('stroke-width', '3px')
            // Label che comapre
            .append('title')
            .text(d => d3.format(".3s")(d['bmi']) + ' bmi')
    }

    const onMouseout = function (event, d) {
        d3.select(this)
            .attr('stroke-width', '1px')
            //.attr('fill', 'red')          // Base
            .attr('fill', d => scaleColor(d['smoker']))     // Per i fumatori
    }

    gContainer
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', handleX)
        .attr('cy', handleY)
        .attr('fill', d => scaleColor(d['smoker']))     // Per i fumatori
        //.attr('fill', 'red')      // Base
        .attr('stroke', 'black')
        .attr('r', handleR)
        // aggiungiamo un tooltip per vedere solo i cerchi con un determinato bmi
        .on('mouseover', onMouseover)
        .on('mouseout', onMouseout);



    /* --- CREAZIONE LEGENDA PER I FUMATORI --- */

    // I dati della legenda: un array di oggetti con la categoria e il testo pulito da mostrare
    const legendData = [
        { key: "yes", label: "Fumatori" },
        { key: "no", label: "Non Fumatori" }
    ];

    // Creiamo il gruppo principale della legenda
    const legend = gContainer.append('g')
        .attr('id', 'scatterplotLegend')
        .attr('transform', `translate(20, 10)`); // Spostata leggermente all'interno del grafico rispetto allo zero

    // Creiamo un gruppo <g> per ogni riga della legenda
    const legendRows = legend.selectAll('g')
        .data(legendData)
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`); // Spazia le righe di 25 pixel in verticale

    // Aggiungiamo il quadratino colorato
    legendRows.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', d => scaleColor(d.key)) // Usa la stessa scala di colori dei cerchi!
        .attr('stroke', 'black')
        .attr('stroke-width', '1px');

    // Aggiungiamo il testo accanto al quadratino
    legendRows.append('text')
        .attr('x', 25)
        .attr('y', 7.5)
        .attr('fill', 'black')
        .style('font-size', '13px')
        .style('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text(d => d.label);
}

//Piechart
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
    // Centro al buco
    const innerRadius = 100;

    // Bordo più esterno
    //metà del lato più piccolo - il margine più grande per lasciare spazio
    const outerRadius = Math.min(chartWidth, chartHeight) / 2
        - Math.max(...Object.values(margin));

    // Crea il gruppo principale del grafico centrato
    const group = svg.append('g')
        .attr('transform', `translate(${margin.left + chartWidth / 2}, 
            ${margin.top + chartHeight / 2})`)
        .attr('id', 'circleGroup');

    // Crea una scala di colori per gli spicchi
    /*const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeTableau10);*/

    /* --- Modifichiamo la scala dei colori --- */
    // 1. Ordiniamo i nomi dei browser dal più grande al più piccolo in base al valore
    const sortedKeys = Object.keys(data).sort((a, b) => data[b] - data[a]);

    // 2. Creiamo l'array con la palette di colori richiesta
    const customColors = ["red", "orange", "yellow", "green", "blue"];

    // 3. Configuriamo la scala ordinale accoppiando le chiavi ordinate ai colori ordinati
    const color = d3.scaleOrdinal()
        .domain(sortedKeys)
        .range(customColors);


    // Calcola gli angoli di ogni sezione del grafico
    const pie = d3.pie().value(d => d[1]);
    arcs = pie(Object.entries(data));

    // Crea i percorsi (path) per ogni arco
    const arcGenerator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let selectedSlice = null;

    group.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .attr("class", d => d.data[0])
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        /* --- Al click visualizzazione del cerchio ed evidenziazione della fetta --- */
        .on('click', function(evt, d) {

            // 1. Rimuoviamo sempre l'eventuale cerchietto nero precedente dal grafico
            group.selectAll('.centroid-marker').remove();

            // 2. Controlliamo se stiamo cliccando la fetta già selezionata
            if (selectedSlice === this) {
                // Ripristina l'aspetto normale
                d3.select(this).style("stroke-width", "2px");
                // Resetta lo stato
                selectedSlice = null;
            }
            // 3. Altrimenti, stiamo cliccando su una nuova fetta
            else {
                // Se c'era una fetta selezionata prima, riportiamola alla normalità
                if (selectedSlice) {
                    d3.select(selectedSlice).style("stroke-width", "2px");
                }

                // Evidenziamo la nuova fetta cliccata
                d3.select(this).style("stroke-width", "4px");

                // Calcoliamo il centroide per la fetta cliccata
                const [cx, cy] = arcGenerator.centroid(d);

                // Disegniamo il cerchietto nero
                group.append('circle')
                    .attr('class', 'centroid-marker') // Classe utile per poterlo rimuovere facilmente dopo
                    .attr('cx', cx)
                    .attr('cy', cy)
                    .attr('r', 4)
                    .attr('fill', 'black');

                // Aggiorniamo la variabile di stato dicendole che questa è la nuova fetta attiva
                selectedSlice = this;
            }
        })
        /*.on('mouseover', function(evt, d){
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

        })*/

    /* --- Cerchi e percentuale del browser base --- */
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
        /*.attr('dx', d => d.startAngle < Math.PI? "0.5em": "-0.5em")
        .attr('dy', '-0.5em')
        .style('text-anchor',
            d => d.startAngle < Math.PI? "start": "end")*/
        /* --- Avere le percentuali in alto al centro rispetto al cerchio --- */
        .attr('dy', '-15px')
        .style('text-anchor', 'middle')

        .style('font-size', '17px')



    get_color = (d, i) => {
        const [group, value] = d.data;
        return color(group)
    }

    createLegend(svg, arcs, get_color, normalizedValueStr,[chartWidth, margin])
}

async function piechart(){

    //let data = {a: 9, b: 20, c: 7, d: 30, e: 12};       // Statica

    /* --- Dinamica --- */
    let rawData = await d3.csv('./datasets/browser_data.csv');
    let data = {};
    rawData.forEach(row => {
        data[row.browser] = +row.share;
    });

    // Calcola la somma totale dei valori
    const sumValues = d3.sum(Object.values(data));

    // Normalizza i valori in percentuale
    // 9 : 78 = x : 100
    const normalizedValue = v => d3.format(".2s")(v * 100 / sumValues);
    const normalizedValueStr = v => `${normalizedValue(v)}%`;
    renderPiechart('piechartSVG', [data, normalizedValueStr])
}

/*
// Globale
let selectedSlice = null;

        // Da mettere nel selectAll
        .on('click', function(event, d) {
            // Chiamiamo la funzione esterna passandole l'elemento (this), il gruppo e il generatore
            onClickSlice(event, d, this, group, arcGenerator);
        });

// La funzione esterna
function onClickSlice(event, d, clickedElement, group, arcGenerator) {

    // 1. Pulizia: rimuoviamo il cerchio marcatore precedente
    group.selectAll('.centroid-marker').remove();

    // 2. Logica di deselezione (click sulla fetta già attiva)
    if (selectedSlice === clickedElement) {
        d3.select(clickedElement).style("stroke-width", "2px");
        selectedSlice = null; // Resettiamo la memoria
    }
    // 3. Logica di selezione (click su una nuova fetta)
    else {
        // Ripristiniamo la vecchia fetta se ne avevamo cliccata un'altra prima
        if (selectedSlice) {
            d3.select(selectedSlice).style("stroke-width", "2px");
        }

        // Evidenziamo la nuova fetta
        d3.select(clickedElement).style("stroke-width", "4px");

        // Calcoliamo e disegniamo il cerchio
        const [cx, cy] = arcGenerator.centroid(d);
        group.append('circle')
            .attr('class', 'centroid-marker')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 4)
            .attr('fill', 'black');

        // Salviamo questa fetta nella memoria per il prossimo click!
        selectedSlice = clickedElement;
    }
}
*/
