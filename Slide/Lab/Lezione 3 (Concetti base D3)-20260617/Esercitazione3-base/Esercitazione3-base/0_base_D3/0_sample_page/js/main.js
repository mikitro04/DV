window.onload = main;

function main() {

    // selectEdit()
    // propsEdit()
    // eventHandler()
    // databinding()
    // append()
    // remove()
}

function selectEdit(){
    // Selezione elementi. Differenze tra JS e D3
    // Con JavaScript puro
    document.querySelector("p");
    document.getElementById("mainContainer");

    // Con D3.js


    // Modifica degli elementi
    // Con D3
    d3.select("rect").attr("width", 100).attr("height", 50);

    // Con JavaScript puro

    // Con funzione Callback

    // Se si vuole recuperare il valore di un attributo
    // Con D3
    let widthD3 = null; //modificare qui

    // Con JavaScript puro
    let widthJS = document.querySelector("rect").getAttribute("width");

    console.log("Width D3: %s \nWidth JS: %s", widthD3, widthJS);
}

function propsEdit() {
    //Cambiare colore e font di un paragrafo.
    // Con D3

    // Con JavaScript puro
    document.querySelector("p").style.color = "blue";
    document.querySelector("p").style.fontSize = "20px";


    // Selezionare una checkbox e impostarla su "checked" (selezionata)
    // Con D3

    // Con JavaScript puro
    document.querySelector("input").checked = true;


    // Cambiare i valore di un campo di testo
    // Con D3

    // Con JavaScript puro
    document.querySelector("input").value = "Nuovo testo";


    // Modificare il testo di un paragrafo
    // Con D3

    // Con JavaScript puro
    document.querySelector("p").innerText = "Nuovo testo con JavaScript!";
}

function eventHandler() {
    //Con JavaScript puro
    document.querySelector("button").addEventListener("click", function() {
        alert("Bottone cliccato!");
    });

    // Con D3
    d3.select("button").on("click", function() {
        alert("Bottone cliccato!");
    });

    // Funzione per cambiare il colore e il testo al paragrafo con D3

}

function databinding() {
    const data = [30, 50, 80]; // Tre numeri che rappresentano i raggi

    d3.select("#container") // Seleziona l'SVG
        .selectAll("circle") // Seleziona tutti i cerchi (inizialmente nessuno)
        .data(data) // Associa i dati alla selezione
        .join("circle") // Crea un <circle> per ogni dato
        .attr("cx", (d, i) => (i + 1) * 100) // Posizione X
        .attr("cy", 100) // Posizione Y
        .attr("r", d => d) // Il raggio è il valore del dato
        .attr("fill", "blue"); // Colore

}

function append() {
    //Seleziona il contenitore SVG e aggiunge un cerchio
    d3.select("container")
        .append("circle")
        .attr("cx", 260)
        .attr("cy", 40)
        .attr("r", 30)
        .attr("fill", "blue")


    const newData = [50, 100, 150];

    d3.select("#container")
}

function remove() {
    //Seleziona un cerchio e lo rimuove, quale?
    d3.select("circle").remove();

    const newData = [50, 100]; // Ora abbiamo solo due elementi

    //Seleziona il contenitore SVG e aggiorna il contenuto
    d3.select("#container")


}