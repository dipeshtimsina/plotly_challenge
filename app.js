//first create the metadata
function buildMetadata(sample) {
    console.log(sample)
     // use the json data provided
     d3.json("data/samples.json").then(data => {
       // metadata array to a variable
       var metadata = data.metadata;
       console.log(metadata)
   
       // Filter samples to resultArray to return value in an array of information, then assisgn variable to just get array information
       var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)
       var result = resultArray[0]
       // Assign statment to info box, then go through all the objects in the result above
       var PANEL = d3.select("#sample-metadata");
       PANEL.html("");
       Object.entries(result).forEach(([key, value]) => {
         PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      
       });
     })
   }
   
   
   // define a function for plotting 
   function buildCharts(sample) {
     d3.json("data/samples.json").then(data => {
       var samples = data.samples;
       var resultArray = samples.filter(sampleObj => sampleObj.id === sample)
       var result = resultArray[0]
   
       //OTU (to read the observed units), assign ids and lables for the result
       var otu_ids = result.otu_ids;
       var otu_labels = result.otu_labels;
       var sample_values = result.sample_values; 
       //similarly for the y 
       yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
   //to generate bar chart sample var data 
       var barData = [
         {
           y: yticks,
           x: sample_values.slice(0, 10).reverse(),
           text: otu_labels.slice(0, 10).reverse(),
           type: "bar",
           orientation: "h"
         }
       ]
       //utilize plotly and graph the bar, and next buble chart, initialize var for bubble layout 
       Plotly.newPlot("bar", barData)
       var bubblelayout = {
         title: "Bacteria Cultures in Each Sample",
         margin: { t: 0 },
         hovermode: "closest",
         xaxis: { title: "OTU ID" },
         margin: { t: 30 }
       };
       //data for the bubble layout aboved 
       var bubbleData = [{
         x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode: "markers",
         marker: {
           size: sample_values,
           color: otu_ids,
           colorscale: "Earth"
         }
       }
       ];
       //create the chart 
       Plotly.newPlot("bubble", bubbleData, bubblelayout)
       console.log(result)
   
     })
   }
   
   //to fill the first chart 
   function init() {
     var selector = d3.select("#selDataset");
     d3.json("data/samples.json").then(data => {
       var sampleNames = data.names;
       sampleNames.forEach(sample => {
         selector
         .append("option")
         .text(sample)
         .property("value", sample);
       })
       //first sample 
       var firstSample = sampleNames[0]
       // Build bar chart
       buildCharts(firstSample);
       buildMetadata(firstSample);
     })
   
   }
   // change function with dropdown selection
   function optionChanged(newSample) {
     buildCharts(newSample);
     buildMetadata(newSample);
   }
   
   init();