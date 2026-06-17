window.onload = main;

async function main() {
    let data = await getData();
    let processedData = await preprocessData(data);
    renderData(processedData);
}

async function get_data() {
    const csv_path = "./dataset/bitcoin.csv";
    // Recuperare i dati

    // Visualizzare dati sulla console

    // restituire i dati

}

async function preprocessData(data) {
    //processare i dati da stringhe a date e number
    const dataStringFormat = "%Y-%m-%d"
    const timeParser = d3.timeParse(dataStringFormat);
    //restituisci i dati processati
}
function render_data(data) {

    const w_svg = 650;
    const h_svg = 500;

    // Creare un nuovo elemento <svg>

    // Creare un nuovo gruppo all'interno dell svg

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

    // Funzioni per mappare i dati con le scale functions
    const scaleX = null;

    const scaleY = null;


    // Aggiungere il path per il grafico
    gContainer.append("path") // Modificare

    // Creare gli assi con D3
    createAxisXD3(gContainer, scaleX, hChart);
    createAxisXD3(gContainer, scaleY);

    // ESERCIZIO TOOLTIP
    // linechart_tooltip(svg, gContainer, scaleX, scaleY, margin, wChart, hChart)
}


// d3 axes: https://d3js.org/d3-axis#axisTop
function createAxisX_D3Way(gContainer, scaleX) {
    gContainer.append("g")
        .attr("transform", "translate(0," + h_chart + ")")
        .call(d3.axisBottom(scaleX));
}

function createAxisY_D3Way(gContainer, scaleY) {
    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
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
    const tooltip = null;

    // Rettangolo bianco con bordo nero
    tooltip.append('rect') //Aggiungere attributi

    // Testo che contiene la data
    const dateText = tooltip.append('text') //Aggiungere attributi

    // Testo che contiene il prezzo
    const priceText = tooltip.append('text') //Aggiungere attributi

    // 2 Disegna la linea (Y=0)
    const yLine = gContainer.append('line') //Aggiungere attributi

    // Disegna la linea (X=0)
    const xLine = gContainer.append('line') //Aggiungere attributi

    // 3
    // Cattura la posizione del mouse sul grafico e usa le scale inverse per ottenere le posizioni x,y per ottenere la data e il valore
    svg.on('mousemove', function (e) {
        // Per fare il rettangolo leggermente spostato rispetto al mouse, altrimenti non si riesce a vedere la posizione del mouse
        const x_offset = 60, y_offset = 30;

        // Ottieni la posizione x,y del mouse. Hint: usa d3.pointer [https://d3js.org/d3-selection/events#pointer]
        const [x, y] = null; // Modificare

        // Inverti la x e la y per ottenere i valori originali. Hint: usa scaleX.invert e scaleY.invert [https://d3js.org/d3-scale/linear#linear_invert]
        // Ricordati che l'evento è relativo all'svg, mentre le scale sono relative al gContainer (hanno la stessa origine?)
        const netX = x - margin.left;
        const netY = y - margin.top;
        const date = null; // Modificare
        const value = null; // Modificare

        // Assegna le variabili come testo dei text dentro al tooltip
        dateText.text() // Modificare
        priceText.text() // Modificare

        // Trasla il tooltip vicino alla posizione del mouse
        tooltip.attr('transform', `translate(${x - x_offset}, ${y - y_offset})`)

        // Mostra il tooltip
        tooltip.style('opacity', 1)

        // Mostra e trasla le linee (Y=0) e (X=0) esattamente nella posizione del mouse
        yLine.style() // Aggiungere opacità
        xLine.style() // Aggiungere opacità
        yLine.attr() // Definire coordinate x1 e x2
        xLine.attr() // Definire coordinate x1 e x2
    })
    // Quando il mouse esce dal grafico => un EVENTO 'mouseout'
    svg.on('mouseout', function (e) {
        // Nascondi il tooltip

        // Nascondi le linee
    })
}