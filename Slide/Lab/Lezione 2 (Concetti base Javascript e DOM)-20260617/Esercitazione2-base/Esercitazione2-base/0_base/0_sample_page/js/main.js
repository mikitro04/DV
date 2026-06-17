window.onload = main;

function main() {
    // This message is shown in the Browser console. Use the shortcut
    console.log("You can read the console.log(...) from the browser's developer tools!")

    // This is a comment. Comments are ignored by the JavaScript interpreter.
    console
        .log("An instruction can be written on a single line, " +
            "or it can be split into multiple lines. " +
            "The semicolon at the end is optional (;).");


    // variablesDeclaration()
    // dataTypes()
    // operators()
    // controlStructures()
    // callbacks()
    // DOM()
}

function variablesDeclaration() {
    // Variables can be declared using the var, let, or const keywords.
    // var is the old way of declaring variables, and it's not recommended to use it anymore.
    // let and const are the new ways of declaring variables, and they are recommended to use.

    // let is used to declare a variable that can be reassigned.

    // const is used to declare a variable that cannot be reassigned. Declare y = 5
    // and then do y = 6; This will cause an error.

    // Variables can be declared without being assigned a value. In this case, the value of the variable is "undefined".

}

function dataTypes() {
    // JavaScript is a loosely typed language, meaning that you don't have to declare the type of a variable when you declare it.
    // The type of a variable is determined when the variable is assigned a value.

    // There are 7 data types in JavaScript:
    // - Number
    // - String
    // - Boolean
    // - Object
    // - Function
    // - Undefined
    // - Null

    // Number (there is no distinction between integers and floats in js... they are all "Number")

    // String

    // Boolean

    // Null

    // Undefined

    // Array

    // Object (it's like a dictionary in Python, or a map in Java)

    // Function

    // Side note about arrow functions:
    // let sum = (a, b) => {console.log(a,b); return a + b};
    // If the function has only one line, you can omit the curly braces and the return statement:
    // let sum = (a, b) => {return a + b};
    // let sum = (a, b) => a + b;


}

function operators() {
    // Arithmetic operators
    //TODO +, -, *, /, %, **

    // Assignment operators
    //TODO =, +=, -=, *=, /=, %=, **=


    // Comparison operators
    //TODO ==, ===, !=, !==

    //TODO  >, <, >=, <=,

    // Logical operators
    //TODO  &&, ||, !
}

function controlStructures() {
    //TODO if

    //TODO if-else

    //TODO if-else if-else (giorno della settimana)

    //TODO switch (giorno della settimana)

    //TODO for


    // while

    // do-while

    // for .... in ....

    // for .... of ....

}

function callbacks() {
    // A callback is a function that is passed as an argument to another function.
    // The callback function is called inside the function it was passed to.
    function IWantACallback(callback) {
        console.log("\nI want a callback!");
        callback();
    }

    function myCallback() {
        console.log("Here is your callback!");
    }
    console.log("\nIWantACallback(myCallback)");

    IWantACallback(myCallback);
    //TODO Creare un'altra callback e passarla a IWantACallback (senza creare una variabile)


    function IWantACallbackWithNumberArgument(callback) {}

    // E' equivlaente: function add5(number) {return number + 5;}
    const add5 = number => number + 5

    //TODO Creare un'altra callback che restituisce il doppio del numero passato
}

function DOM() {
    // The Document Object Model (DOM) is a programming interface for web documents.
    // It represents the page so that programs can change the document structure, style, and content.
    // The DOM represents the document as nodes and objects.
    // This allows programming languages to connect to the page.


    //TODO Trova il PRIMO elemento con TAG "text" e stampalo a console
    const first_text = null; // TODO Edit this line
    console.log("The first text:", first_text);


    //TODO Trova TUTTI gli elementi con TAG "text"
    const all_texts = null; // TODO Edit this line
    console.log("All texts:", all_texts);


    //TODO Ottieni il PRIMO elemento con CLASSE "small"
    const first_classed_small = null; // TODO Edit this line
    console.log("The first .small:", first_classed_small);


    //TODO Ottieni TUTTI gli elementi con classe "small"
    const all_classed_small = null; // TODO Edit this line
    console.log("All .small:", all_classed_small);


    //TODO Ottieni il PRIMO "text" contenuto dentro ad un gruppo "g"
    const first_text_inside_group = null; // TODO Edit this line
    console.log("first \"g text\":", first_text_inside_group);


    //TODO Ottieni TUTTI i text contenuti dentro ad un gruppo "g"
    const all_text_inside_groups =  null; // TODO Edit this line
    console.log("all \"g text\":", all_text_inside_groups);


    //TODO Cambia il contenuto (textContent) del primo text (salvato in first_text) in "Non sono più \"My\"";
    //TODO Write here


    // Create a new element with the tag "rect" and append it to the first group (you have to select it).

    // Add an event listener to the element with the id "newP" that when hovered changes the color of p in red.

    // Now add the event listener that restores the color to black when the mouse leaves the element.

}

