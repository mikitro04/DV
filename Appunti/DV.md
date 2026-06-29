# Data Visualization
Ignorando i concetti base HTML e CSS.

## SVG
**S**calable **V**ector **G**raphics, serve per creare gtafica vettoriale. Si usa il tag `<svg> ... </svg>`.  
Esempio pratico:
```html
...
<svg height="300" width="300">
	<rect x="25" y="25" width="100" height="50"/>
	<circle cx="200" cy="70" r="50"/>
	<line x1="25" y1="100" x2="125" y2="100" stroke="black"/>
</svg>
...
```

### Rettangoli
Si usa il tag `<rect/>` si popola con: 
* `x` e `y` per le coordinate di origine
* `height`: altezza
* `width`: larghezza

### Cerchio
Si usa il tag `<circle/>` si popola con: 
* `cx` e `cy` per le coordinate del centro
* `r`: raggio

### Linee
Si usa il tag `<line/>` si popola con: 
* `x1` e `y1` per le coordinate dell'inizio
* `x2` e `y2` per le coordinate della fine
* `stroke`: colore

### Gruppi
Creare gruppi permette di **trasformazioni**, **stili** o **attributi** a tutti gli elementi che contiene.  
Si usa il tag `<g> ... </g>`, esempio pratico:
```html
...
<svg height="300" width="300">
	<g fill="none" stroke="green" stroke-width="4px">
		<rect x="25" y="25" width="100" height="50"></rect>
		<circle cx="200" cy="70" r="50"></circle>
		<line x1="25" y1="100" x2="125" y2="100" ></line>
	</g>
</svg>
...
```
In questo caso si applicano le caratteristiche `fill`, `stroke` e `stroke-width` a tutti gli elementi racchiusi nel tag `<g>`.

### Percorsi
Permette di creare linee, curve, archi e altre geometrie avanzate che non sono possibili con altri elementi SVG. Si indica con il tag `<path/>`.
* Per disegnare percorsi si utilizza il campo `d="..."` ('data'):  
	* `Mx y`: Sposta il punto di partenza del disegno alle coordinate x y (e.g. `M10 10` imposta il punto iniziale alle coordinate x=10 e y=10);
	* `Lx y`: Disegna una linea dal punto attuale al punto indicato nelle coordinate
	* `Hx` / `Vy`: Horizontal o Vertical Line, disegna una linea orizzontale o verticale verso la coordinata indicata;
	* `Z`: Chiude il percorso collegando l'ultimo punto al primo.
	* Usare lettere _MAIUSCOLE_ o _minuscole_ cambia:
		* _MAIUSCOLE_: Usano le coordinate assolute;
		* _minuscole_: Usano le coordinate rispetto al punto attuale.
* `fill`: Speciﬁca il colore di riempimento della forma;
* `stroke`: Speciﬁca il colore del bordo;
* `stroke-width`: Deﬁnisce lo spessore del bordo.

Esempio completo:
```html
...
<svg>
	<g>
		<path d="M10 150 50 100
				 L90 120 L130 80
				 L170 140 L210 60
				 L250 100 L290 50
				 L330 120 Z"
			stroke="blue"
			fill="none"
			stroke-width="2"/>
	</g>
</svg>
...
```
Quello che faremo sarà combinare tutte queste cose assieme:
```html
...
<svg>
	<g>
		<path d="M10 150 50 100
				 L90 120 L130 80
				 L170 140 L210 60
				 L250 100 L290 50
				 L330 120 Z"
			stroke="blue"
			fill="none"
			stroke-width="2"/>
		
		<circle cx="10" cy="150"  r="4" fill="red" />
		<circle cx="50" cy="100"  r="4" fill="red" />
		<circle cx="90" cy="120"  r="4" fill="red" />
		<circle cx="130" cy="80"  r="4" fill="red" />
		<circle cx="170" cy="140" r="4" fill="red" />
		<circle cx="210" cy="60"  r="4" fill="red" />
		<circle cx="250" cy="100" r="4" fill="red" />
		<circle cx="290" cy="50"  r="4" fill="red" />
		<circle cx="330" cy="120" r="4" fill="red" />
	</g>
</svg>
...
```
Applicheremo lo stile del file CSS ai vari tag o classi del file.  
```CSS
svg {		/* Stile per il tag specifico sgv */
	...
}

.red-empty-circle  {	/* Stile per la classe chiamata `red-empty-circle` */
	...
}
```
## Allegare file
* I file **CSS** si usa il seguente comando nella parte `head` del file html:
	```html
	...	
	<head>
		...
		<link rel="stylesheet" href="css/style.css">
		...
	<head>
	...	
	```
* Mentre ivece i file JavaScript così:
	```html
	...	
	<head>
		...
		<script type="text/javascript" src="js/main.js"></script>
		...
	<head>
	...	
	```
## RICORDA
Ricorda bene: 
* Le **classi** si selezionano con `.nome-classe`
* Gli **ID** con `#nome-id`
* Mentre i tag semplicemente `nome-tag`

Quindi se devi fare `d3.select(...)` dentro le parentesi devi inserire la selezione dell'elemento desiderato quindi `d3.select(rect)` o `.rettangoli` e così via.

## JS
Per selezionare un elemento si usa `document.querySelector("xx")`, al posto di `xx` si può mettere il tag (e.g. `g`, `text` o `g text` quindi il primo `text` dentro `g`) oppure le classi o gli id.  
Per selezionare tutti gli elementi di quel tipo: `document.querySelectorAll("xx")`  
Selezionato l'elemento puoi aggiungere attributi con `.setAttribute("nome-attributo", valore)`.  
Per creare l'elemento usi `document.createElementNS("http://www.w3.org/2000/svg", "tag-elemento")`.

Per creare un **EventListener** ad un oggetto ***x*** si usa:
```JavaScript
x.addEventListener("evento", () => {
        // Evento
    });
```

## d3
Per usare d3 si usa appunto `d3`, alla quale vengono aggiunte funzioni (**concatenabili**) come:
* `.select` / `.selectAll`: alla quale si inserisce il tag, classe o id da ricercare (e.g. `cont x = d3.selectAll("circle");`)
* `.attr`: che è la stessa cosa della roba *js* per aggiungere attributi (e.g. `x.attr("fill", "red");`)
* Ottenere ID elemento: facendo una `.selectAll` otteniamo tutti gli elementi di quel tipo, per ottenere l'id progressivo di quel singolo elemento usiamo la seguente formula da usare all'interno delle funzioni:
	```JavaScript
	function (_, i) {
        let r = get_radius(i);
        return r;
    }
	```
	e.g. di utilizzo:
	```JavaScript
	x.attr("r", function (_, i) {
        let r = (i+1)*10;			// NB l'id parte da 0
        return r;
    })
	```
* `.text`: assegna il testo nel caso sia una label
* `.on`: per aggiungere eventi come `mouseover`, `mouseout`, `click` (e.g. `d3.select("element").on("click", function() {...})`)
* Funzione per recuperare i dati da un CSV:
	```JavaScript
	async function get_data() {
		const csv_path = "./dataset/bitcoin.csv";
		// Recuperare i dati
		const data = await d3.csv(csv_path);
		// Visualizzare dati sulla console
		console.log(data);
		// restituire i dati
		return data;
	}
	```
* Funzione per il **preprocessing dei dati**:
	```JavaScript
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
	```
* Per capire se il puntatore del mouse si sta muovendo sopra un elemento `x` usiamo 
	```JavaScript
	x.on('mousemove', function (e) {...})
	```  
	Dove all'interno della funzione scriviamo cosa accade, per esempio
	* Prendere le coordinate del mouse
		```JavaScript
		const [x, y] = d3.pointer(e);
		```

* Per capire se il puntatore ha lasciato l'elemento x usiamo:
	```JavaScript
	x.on('mouseout', function (e) {...})
	```


---
---

# Codici

## HTML
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>BarChart, Scatterplot & PieChart</title>
    <link type="text/css" rel="stylesheet" href="style.css">
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/d3.v7.js"></script>
</head>

<body>

    <div>
        <h1>
            Il mio barchart
        </h1>

        <svg id="barchartSVG" width="800" height="650">

        </svg>
    </div>

    <div>
        <h1>
            Il mio scatterplot
        </h1>

        <svg id="scatterplotSVG" width="800" height="650">

        </svg>
    </div>

    <div>
        <h1>
            Il mio piechart
        </h1>

        <svg id="piechartSVG" width="800" height="650">

        </svg>
    </div>
</body>

</html>
```

## CSS
```CSS
svg {
    border: black solid 1px;
}

svg path.hovered{
    opacity: 1 !important;
    stroke-width: 4px !important;
}

.hovered text {
    font-size: 20px;
    font-weight: bold;
}

.hovered rect {
    stroke-width: 1px !important;
    stroke: black !important;
}
```

## JavaScript

### main
```JavaScript
window.onload = main;

async function main(){
    barchart();
    scatterplot();
	piechart();
}
```

### Dati
```JavaScript
async function getData(path){
    // Recuperare i dati
    const data = await d3.csv(path);
    // Visualizzare dati sulla console
    console.log(data);
    // restituire i dati
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

// Per grafi
async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}
```

### BarChart
```JavaScript
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
        .padding(0.3);

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
            .append('title')
            .text(d => d3.format(".3s")(d['population']))
    }

    const onMouseout = function (event, d) {
        d3.select(this)
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
```

### ScatterPlot
```JavaScript
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
    const age_var = 'age';
    const charges_var = 'charges';

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
        .text(age_var.toUpperCase())

    // Asse Y
    gContainer.append("g")
        .call(d3.axisLeft(scaleY))
        // Add the label
        .append("text")
        .attr("fill", "black")
        .attr('x', 0)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr('dominant-baseline', 'text-after-edge')
        .text(charges_var.toUpperCase())

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
```

### PieChart
```JavaScript
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
```

### Legenda
```JavaScript
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
```