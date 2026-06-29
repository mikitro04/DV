window.onload = main;

function main() {
    DOM()
}

function DOM() {
    // The Document Object Model (DOM) is a programming interface for web documents.
    // It represents the page so that programs can change the document structure, style, and content.
    // The DOM represents the document as nodes and objects.
    // This allows programming languages to connect to the page.


    //TODO Trova il PRIMO elemento con TAG "text" e stampalo a console
    const first_text = document.querySelector("text"); // TODO Edit this line
    console.log("The first text:", first_text);


    //TODO Trova TUTTI gli elementi con TAG "text"
    const all_texts = document.querySelectorAll("text"); // TODO Edit this line
    console.log("All texts:", all_texts);


    //TODO Ottieni il PRIMO elemento con CLASSE "small"
    const first_classed_small = document.querySelector(".small"); // TODO Edit this line
    console.log("The first .small:", first_classed_small);


    //TODO Ottieni TUTTI gli elementi con classe "small"
    const all_classed_small = document.querySelectorAll(".small"); // TODO Edit this line
    console.log("All .small:", all_classed_small);


    //TODO Ottieni il PRIMO "text" contenuto dentro ad un gruppo "g"
    const first_text_inside_group = document.querySelector("g text");; // TODO Edit this line
    console.log("first \"g text\":", first_text_inside_group);


    //TODO Ottieni TUTTI i text contenuti dentro ad un gruppo "g"
    const all_text_inside_groups =  document.querySelectorAll("g text"); // TODO Edit this line
    console.log("all \"g text\":", all_text_inside_groups);


    //TODO Cambia il contenuto (textContent) del primo text (salvato in first_text) in "Non sono più \"My\"";
    //TODO Write here
    first_text.textContent = "Non sono piu' \"My\"";

    // Create a new element with the tag "rect" and append it to the first group (you have to select it).
    const svgNS = "http://www.w3.org/2000/svg";
    let rec = document.createElementNS(svgNS, "rect");
    rec.setAttribute("width", 50);
    rec.setAttribute("height", 50);
    rec.setAttribute("opacity", 0.5);
    document.querySelector("g").appendChild(rec);

    // Add an event listener to the element with the id "newP" that when hovered changes the color of p in red.
    rec.addEventListener("mouseover", () => {
        rec.setAttribute("fill", "red")
    });
    // Now add the event listener that restores the color to black when the mouse leaves the element.
    rec.addEventListener("mouseleave", () => {
        rec.setAttribute("fill", "blue")
    });
}

