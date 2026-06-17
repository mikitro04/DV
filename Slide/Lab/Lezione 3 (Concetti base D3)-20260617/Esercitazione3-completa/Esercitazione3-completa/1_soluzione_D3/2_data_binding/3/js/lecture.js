// Rimuove il primo cerchio trovato
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



