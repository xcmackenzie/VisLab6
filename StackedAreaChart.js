
export default function StackedAreaChart(container) {
    let outerWidth = 650
    let outerHeight = 500
    let margin = {top: 40, bottom: 40, left: 40, right: 40}
    let w = outerWidth - margin.left - margin.right
    let h = outerHeight - margin.top - margin.bottom

    const svg = d3.select(container)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr("x", 0)
        .attr("y", 0)

    const xScale = d3.scaleTime()
        .rangeRound([0, w])

    const yScale = d3.scaleLinear()
        .rangeRound([h, 0])

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

    const xAxis = d3.axisBottom()
        .scale(xScale)

    const yAxis = d3.axisLeft()
        .scale(yScale)

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${h})`)

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)

    const tooltip = svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", 10)
        .attr("text-anchor", "start")

    let selected = null, xDomain, data
        
    function update(_data) {
        data = _data

        const keys = selected ? [selected] : data.columns.slice(1)
        console.log(keys)

        const stackedData = d3.stack()
            .keys(keys)
            (data)
    
        console.log(stackedData)
        console.log(xDomain)

        xScale.domain(xDomain? xDomain: d3.extent(data, d => d.date))
        yScale.domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        colorScale.domain(keys)

        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))

        const areas = svg.selectAll(".area")
            .data(stackedData)

        areas.enter()
            .append("path")
            .attr("clip-path", "url(#clip)")
            .attr("class", "area")
            .merge(areas)
            .attr("fill", d => colorScale(d.key))
            .attr("d", area)
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseleave", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                if (selected === d.key) {
                    selected = null
                } else {
                    selected = d.key
                }
                update(data)
            })

        areas.exit().remove()

        svg.selectAll(".axis.x-axis")
            .call(xAxis)

        svg.selectAll(".axis.y-axis")
            .call(yAxis)

    }
    function filterByDate(range) {
        xDomain = range
        update(data)
    }
    return {
        update,
        filterByDate
    }
}