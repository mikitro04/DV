window.onload = main;

async function main() {
    let data = await getData();
    let processed_data = await preprocessData(data);
    renderData(processed_data);
}

async function getData() {
    const csv_path = "./dataset/bitcoin.csv";
    // Recuperare i dati
    const data = await d3.csv(csv_path);
    // Visualizzare dati sulla console
    console.log(data);
    // restituire i dati
    return data;
}

async function preprocessData(data) {
    //processare i dati da stringhe a date e number
    const dataStringFormat = "%Y-%m-%d"
    const timeParser = d3.timeParse(dataStringFormat);
    //restituisci i dati processati
    return data.map(row => ({
        ...row,
        'date': timeParser(row['date']),
        'value': +row['value']
    }))
}
function renderData(data) {

    const w_svg = 650;
    const h_svg = 500;

    // Creare un nuovo elemento <svg>
    const svg = d3.create("svg")
        .attr("width", w_svg)
        .attr("height", h_svg);

    document.body.appendChild(svg.node());

    // Creare un nuovo gruppo all'interno dell svg
    const gContainer = svg.append("g");

    //margini del grafico
    const margin = {
        top: 40,
        right: 60,
        bottom: 40,
        left: 60
    };

    //dimensioni grafico
    const wChart = w_svg - margin.left - margin.right;
    const hChart = h_svg - margin.top - margin.bottom;

    // Centriamo l' sgv
    gContainer.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Funzioni per mappare i dati con le scale functions
    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, wChart])
        .nice();

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .range([hChart, 0])
        .nice();


    // Aggiungere il path per il grafico
    gContainer
        .append("path")
        .datum(data)
        .attr("stroke", "blue")

        /*  --- Ad Area
            .attr("fill", "blue")
            .attr("d", d3.area()
            .x(d => scaleX(d.date))
            .y0(hChart)
            .y1(d => scaleY(d.value)))
        */
        /*  --- A Linea
        */
            .attr("fill", "none")
            .attr("d", d3.line()
            .x(d => scaleX(d.date))
            .y(d => scaleY(d.value)))

    // Creare gli assi con D3
    createAxisXD3(gContainer, scaleX, hChart, wChart, "Prezzo");
    createAxisYD3(gContainer, scaleY, "Data");

    // ESERCIZIO TOOLTIP
    linechart_tooltip(svg, gContainer, scaleX, scaleY, margin, wChart, hChart)

    // AGGIUNTA DEI CERCHI ROSSI
    gContainer.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => scaleX(d.date))
        .attr("cy", d => scaleY(d.value))
        .attr("r", 5)
        .attr("fill", "red");
}


// d3 axes: https://d3js.org/d3-axis#axisTop
function createAxisXD3(gContainer, scaleX, h_chart, w_chart, label_text) {
    const xAxisGroup = gContainer.append("g")
        .attr("transform", "translate(0," + h_chart + ")")
        .call(d3.axisBottom(scaleX));

    // Attacchiamo il testo direttamente al gruppo dell'asse
    xAxisGroup.append("text")
        .attr("x", w_chart)
        .attr("y", 35) // NOTA: Solo 35! Essendo dentro xAxisGroup, si trova già in fondo al grafico
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(label_text);
}

function createAxisYD3(gContainer, scaleY, label_text) {
    const yAxisGroup = gContainer.append("g")
        .call(d3.axisLeft(scaleY))

    // Attacchiamo il testo direttamente al gruppo dell'asse
    yAxisGroup.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(label_text);
}

function linechart_tooltip(svg, gContainer, scaleX, scaleY, margin, w_chart, h_chart) {
    /**
     * Esercizio: creare un tooltip che si attiva quando il mouse si muove sopra il grafico (mousemove).
     * 1. Aggiungere un gruppo all'svg che contiene un rettangolo e due testi (uno per la data e uno per il valore)
     *      - il rettangolo deve essere bianco con bordo nero
     *      - i testi devono essere neri, font-size 10px, dominant-baseline a middle. Font-weight bold per la data
     * P.S. il tooltip deve essere inizialmente invisibile
     *
     * 2. Disegnare due linee tratteggiate (stroke-dasharray)
     *      - una orizzontale (Y=0) e una verticale (X=0)
     *
     * 3. Quando il mouse si muove (mousemove) sul grafico (svg):
     *      - catturare la posizione del mouse (d3.pointer)
     *      - sfruttare l'invert delle scale per passare da px a valori di data e valore.
     *              Fai attenzione che la posizione del mouse è relativa all'svg, mentre le scale sono relative al gContainer (e il gContainer è traslato rispetto all'svg
     *      - aggiorna il contenuto dei due testi con la data e il valore ottenuti al passo precedente
     *      - trasla il gruppo vicino alla posizione del mouse (aggiungi dell'offset per chiarezza)
     *      - trasla le linee tratteggiate sulla posizione esatta del mouse
     *      - mostra il tooltip
     * 3. Quando il mouse esce dal grafico, nascondi il tooltip
     */
    const rect_width = 55,
        rect_height = 30,
        rect_x = 0,
        rect_y = -5;

    const text_x = 5,
        text1_y = rect_height * (1 / 3) + rect_y,
        text2_y = rect_height * (2 / 3) + rect_y;

    // 1 TOOLTIP
    const tooltip = svg.append('g');

    // Rettangolo bianco con bordo nero
    tooltip.append('rect')
        .attr("width", rect_width)
        .attr("height",rect_height)
        .attr("x", rect_x)
        .attr('y', rect_y)
        .attr("fill", "white")
        .attr('stroke', "black")

    // Testo che contiene la data
    const dateText = tooltip.append('text')
        .attr("x", text_x)
        .attr("y", text1_y)
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("dominant-baseline", "middle")
        .attr("font-weight", "bold")

    // Testo che contiene il prezzo
    const priceText = tooltip.append('text')
        .attr("x", text_x)
        .attr("y", text2_y)
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("dominant-baseline", "middle")

    // 2 Disegna la linea (Y=0)
    const yLine = gContainer.append('line')
        .attr('stroke', 'black')
        .attr("stroke-dasharray", 5)
        .attr('x1', 0)
        .attr('x2', w_chart)
        .attr('y1', 0)
        .attr('y2', 0)

    // Disegna la linea (X=0)
    const xLine = gContainer.append('line')
        .attr('stroke', 'black')
        .attr("stroke-dasharray", 5)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', h_chart)

    // 3
    // Cattura la posizione del mouse sul grafico e usa le scale inverse per ottenere le posizioni x,y per ottenere la data e il valore
    svg.on('mousemove', function (e) {
        // Per fare il rettangolo leggermente spostato rispetto al mouse, altrimenti non si riesce a vedere la posizione del mouse
        const x_offset = 60, y_offset = 30;

        // Ottieni la posizione x,y del mouse. Hint: usa d3.pointer [https://d3js.org/d3-selection/events#pointer]
        const [x, y] = d3.pointer(e); // Modificare

        // Inverti la x e la y per ottenere i valori originali. Hint: usa scaleX.invert e scaleY.invert [https://d3js.org/d3-scale/linear#linear_invert]
        // Ricordati che l'evento è relativo all'svg, mentre le scale sono relative al gContainer (hanno la stessa origine?)
        const netX = x - margin.left;
        const netY = y - margin.top;
        const date = scaleX.invert(netX);
        const value = scaleY.invert(netY);

        // Assegna le variabili come testo dei text dentro al tooltip
        dateText.text(date) // Modificare
        priceText.text(value) // Modificare

        // Trasla il tooltip vicino alla posizione del mouse
        tooltip.attr('transform', `translate(${x - x_offset}, ${y - y_offset})`)

        // Mostra il tooltip
        tooltip.style('opacity', 1)

        // Mostra e trasla le linee (Y=0) e (X=0) esattamente nella posizione del mouse
        yLine.style("opacity", 1)
            .attr('x1', 0)
            .attr('x2', w_chart)
            .attr('y1', netY)
            .attr('y2', netY);
        xLine.style("opacity", 1)
            .attr('x1', netX)
            .attr('x2', netX)
            .attr('y1', 0)
            .attr('y2', h_chart);
    })
    // Quando il mouse esce dal grafico => un EVENTO 'mouseout'
    svg.on('mouseout', function (e) {
        // Nascondi il tooltip
        tooltip.style('opacity', 0);
        // Nascondi le linee
        yLine.style('opacity', 0);
        xLine.style('opacity', 0);
    })
}