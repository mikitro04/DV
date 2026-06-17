window.onload = main;

function main() {

    // selectEdit()
    // propsEdit()
    // eventHandler()
    // databinding()
     append()
     remove()
}

function selectEdit(){
    // Selezione elementi. Differenze tra JS e D3
    // Con JavaScript puro
    document.querySelector("p");
    document.getElementById("mainContainer");

    // Con D3.js
    d3.select("p");
    d3.select("mainContainer");
    d3.selectAll("circle");


    // Modifica degli elementi
    // Con D3
    d3.select("rect").attr("width", 100).attr("height", 50);

    // Con JavaScript puro
    document.querySelector("rect")
        .setAttribute("width", 100);
    document.querySelector("rect")
        .setAttribute("height", 50);

    // Con funzione Callback
    d3.selectAll("circle")
        .attr("r", function (_, idx) {
            return 10 + (idx * 5);
        });

    // Se si vuole recuperare il valore di un attributo
    // Con D3
    let widthD3 = d3.select("rect").attr("width");

    // Con JavaScript puro
    let widthJS = document.querySelector("rect").getAttribute("width");

    console.log("Width D3: %s \nWidth JS: %s", widthD3, widthJS);
}

function propsEdit() {
    //Cambiare colore e font di un paragrafo.
    // Con D3
    d3.select("p").style("color", "blue").style("font-size", "20px");

    // Con JavaScript puro
    document.querySelector("p").style.color = "blue";
    document.querySelector("p").style.fontSize = "20px";


    // Selezionare una checkbox e impostarla su "checked" (selezionata)
    // Con D3
    d3.select("input").property("checked", true);

    // Con JavaScript puro
    document.querySelector("input").checked = true;


    // Cambiare i valore di un campo di testo
    // Con D3
    d3.select("input[type='text']").property("value", "Nuovo testo");

    // Con JavaScript puro
    document.querySelector("input").value = "Nuovo testo";


    // Modificare il testo di un paragrafo
    // Con D3
    d3.select("p").text("Nuovo testo con D3!");

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

    // Con D3
    d3.select("button").on("click", function() {
        d3.select("p").style("color", "blue").text("Hai cliccato il pulsante!")
    });
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


    const newData = [50, 100, 150]; // Ora abbiamo solo due elementi

    d3.select("#container")
        .selectAll("circle")
        .data(newData) // Aggiorniamo i dati
        .join("circle") // Aggiungiamo nuovi elementi se servono
        .attr("cx", d => d)
        .attr("cy", 100)
        .attr("r", 20)
        .attr("fill", "green")
}

function remove() {
    d3.select("circle").remove();

    const newData = [50, 100]; // Ora abbiamo solo due elementi

    d3.select("#container")
        .selectAll("circle")
        .data(newData) // Aggiorniamo i dati
        .join("circle") // Aggiungiamo nuovi elementi se servono
        .attr("cx", d => d)
        .attr("cy", 100)
        .attr("r", 20)
        .attr("fill", "green")
        .exit() // Se ci sono cerchi in eccesso rispetto a `data`
        .remove(); // Li rimuoviamo


}