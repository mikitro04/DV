window.onload = main;

function main(){
    map();
}

async function getDataJSON(path){
    const data = await d3.json(path);

    console.log(data);
    return data;
}

async function getDataCSV(path){
    const data = await d3.csv(path);
    console.log(data);
    return data;
}

async function map(){
    const mapPath = "./datasets/sardegna.geojson";
    const infoPath = "./datasets/informazioni.csv";

    Promise.all(
        [getDataJSON(mapPath), getDataCSV(infoPath)]
    ).then(([dataJSON, dataCSV]) => {
        renderMap(dataJSON, dataCSV);
    }).catch(error => console.error('Error loading data:', error));

}

function printInfo(svg, svgWidth, svgHeight) {
    const infoLabel = svg.append('g')
        .attr('id', 'info')
        // Spostiamo la traslazione: X a 20 (sinistra) e Y in basso
        .attr('transform', `translate(20, ${svgHeight - 20})`);

    infoLabel.append('text')
        .text('Fai click su una provincia per vedere il numero dei suoi comuni')
        .attr('text-anchor', 'start') // Allinea il testo a sinistra
        .attr('font-weight', 'bold'); // Rende il testo in grassetto
}

function getRadius(currentProv, dataCSV, scaleRadius) {
    const provincia_acronimo = currentProv.properties.prov_acr;
    const provincia_info = dataCSV.find(p => p.provincia === provincia_acronimo);
    const num_abitanti = provincia_info['abitanti'];

    return scaleRadius(num_abitanti);
}


function renderMap(dataJSON, dataCSV) {
    const svg = d3.select("#SardegnaSVG");
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 60, bottom: 40, left: 60}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const projection = d3.geoNaturalEarth1()
        .fitSize([chartWidth, chartHeight], dataJSON);

    const geoGenerator = d3.geoPath().projection(projection);

    // 1. Definiamo la scala lineare come richiesto
    const maxAbitanti = d3.max(dataCSV, d => +d.abitanti);
    const scaleRadius = d3.scaleLinear()
        .domain([0, maxAbitanti])
        .range([1, 50]);

    let selected = null;

    // 2. Disegniamo le province
    gContainer
        .selectAll('path')
        .data(dataJSON.features)
        .join('path')
        .attr('d', geoGenerator)
        .attr('stroke', 'black')
        .attr('fill', 'lightgray')
        .on('click', function (e, d) {
            // Recupera le info della provincia cliccata dal CSV
            const provincia_acronimo = d.properties.prov_acr;
            const provincia_info = dataCSV.find(p => p.provincia === provincia_acronimo);

            // Definiamo il testo da mostrare
            const testoInfo = provincia_info
                ? `Provincia: ${provincia_info.nome} - Numero comuni: ${provincia_info.comuni}`
                : "Informazioni non disponibili";

            if (selected === this) {
                // Ripristina l'aspetto normale
                d3.select(this).attr('fill', 'lightgray');
                // Resetta lo stato
                selected = null;

                // Resetta il testo originale
                svg.select('#info text').text('Fai click su una provincia per vedere il numero dei suoi comuni');
            }else {
                // Se c'era una fetta selezionata prima, riportiamola alla normalità
                if (selected) {
                    d3.select(selected).attr('fill', 'lightgray');
                }

                // Evidenziamo la nuova fetta cliccata
                d3.select(this).attr('fill', 'pink');

                // Aggiorniamo la variabile di stato dicendole che questa è la nuova fetta attiva
                selected = this;

                // Aggiorniamo il testo con i dati della provincia corrente
                svg.select('#info text').text(testoInfo);
            }
        })

    // --- AGGIUNTA LOGICA RESET ---
    d3.select("#reset").on("click", function() {
        // 1. Riporta tutte le province a grigio
        gContainer.selectAll('path').attr('fill', 'lightgray');

        // 2. Resetta la variabile di stato della selezione
        selected = null;

        // 3. Ripristina il testo originale
        svg.select('#info text')
            .text('Fai click su una provincia per vedere il numero dei suoi comuni');
    });

    // 3. Aggiungiamo i centroidi (cerchi)
    gContainer
        .selectAll('circle')
        .data(dataJSON.features)
        .join('circle')
        // GeoJSON non ha coordinate x,y dirette per il centro.
        // geoGenerator.centroid(d) calcola il centro visivo della geometria (poligono)
        // restituendo un array [x, y] usato per cx e cy del cerchio.
        .attr('cx', d => geoGenerator.centroid(d)[0])
        .attr('cy', d => geoGenerator.centroid(d)[1])
        .attr('r', d => getRadius(d, dataCSV, scaleRadius))
        .attr('fill', 'green')
        .attr('fill-opacity', 0.5)
        .attr('stroke', 'green');

    printInfo(svg, svgWidth, svgHeight);
}






