console.log ("Actividad grupal de D3")
d3.json ("https://raw.githubusercontent.com/neoclassicjh/master-herramientas/main/datosdrogas.json").then (function (datosOriginales){
    
    var datos = datosOriginales.Respuesta.Datos.Metricas[0].Datos

    console.log (datos)
    
    //Configuración de parámetros generales de la gráfica
    var margin = { top: 150, right: 40, bottom: 70, left: 100 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    mainColor = "#4E64A6",
    PointsColorScale = d3.scaleLinear().domain ([11000,19000]).range (["#49BF51", "#F25050"]);

    
    //Creación de objeto SVG para el body
    var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Creación y visualización del eje horizontal (X) para la gráfica lineal
    var x = d3.scaleLinear()
    .domain(d3.extent(datos, function(d) { return d.Agno; }))
    .range([0, width]);

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("color", mainColor)
    .call(d3.axisBottom(x));


    //Creación y visualización del eje vertical (Y) para la gráfica lineal
    var y = d3.scaleLinear()
    .domain([0, d3.max(datos, function(d) { return +d.Valor; }) * 1.15])
    .range([height, 0]);

    svg.append("g")
    .attr("color", mainColor)
    .call(d3.axisLeft(y));


    //Creación y visualización del nombre del eje (X)
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .style('fill', mainColor)
    .text("Años");


    //Creación y visualización del nombre del eje (Y)
    svg.append("text")
    .attr("x", -40)
    .attr("y", -8)
    .style('fill', mainColor)
    .text("Casos");


    //Creación de la gráfica lineal
    svg.append("path")
    .datum(datos)
    .attr("fill", "none")
    .transition ()
        .ease(d3.easeLinear)
        .duration(500)
    .attr("stroke", mainColor)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.Agno) })
        .y(function(d) { return y(d.Valor) })

    )


    //Creación del tooltip
    var Tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")


    //Función para mostrar el tooltip cuando el cursor se posiciona sobre un punto del gráfico dejándolo demarcado
    var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.select(this)
        .style("stroke", mainColor)
        .style("opacity", 1)
    }


    //Función para mostrar tootltip cuando el cursor se posiciona sobre un punto del gráfico mostrando la información
    var mousemove = function(d) {
    Tooltip.html("<b> Año: </b>" + d.Agno + "<br/> <b> Casos: </b>" + d.Valor.toFixed(2))
        .style("top", d3.event.pageY + 20 + "px")
        .style("left", d3.event.pageX + 20 + "px")
        .transition()
        .style("opacity", 1)
    }


    //Función para ocultar el tooltip cuando el cursor se aleja
    var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    
    //Adición de los puntos a la linea con la escala de color
    svg.append("g")
    .selectAll("dot")
    .data(datos)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.Agno) })
    .attr("cy", function(d) { return y(d.Valor) })
    .attr("r", 8)
    .attr("fill", d => PointsColorScale(d.Valor))    
    .on("mouseover", mouseover)
    .on("mousemove", d => {
        mousemove(d)
    })
    .on("mouseleave", mouseleave);
    
})