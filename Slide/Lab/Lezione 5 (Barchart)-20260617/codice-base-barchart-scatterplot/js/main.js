window.onload = main;

function main(){
    barchart();
    scatterplot();
}

async function getData(path){
}

//BarChart
function renderBarChart(idSVG, data, sort){

}
async function barchart(){
    let data = await getData("./datasets/barchart_data.csv")
    const idSVG = "barchartSVG";
    const sort = true;

    //processData
    let processedData; 

    renderBarChart(idSVG, processedData, sort);

}

//ScatterPlot
function renderScatterPlot(idSVG, data){
}

async function scatterplot(){

    let data = await getData('../datasets/insurance.csv')
    const idSVG = "scatterplotSVG";

    //processData
    let processedData;

    renderScatterPlot(idSVG, processedData);
}


