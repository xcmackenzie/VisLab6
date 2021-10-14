
export default function AreaChart(container) {
    let outerWidth = 650
    let outerHeight = 150
    let margin = {top: 40, bottom: 40, left: 40, right: 40}
    let w = outerWidth - margin.left - margin.right
    let h = outerHeight - margin.top - margin.bottom

    const svg = d3.select(container)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    const xScale = d3.scaleTime()
        .rangeRound([0, w])

    const yScale = d3.scaleLinear()
        .rangeRound([h, 0])

    svg.append("path")
        .attr("class", "path")

    const xAxis = d3.axisBottom()
        .scale(xScale)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(3)

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${h})`)

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)

    const brush = d3.brushX()
        .extent([[0, 0], [w, h]])
        .on("brush", brushed)
        .on("end", brushended)

    svg.append("g")
        .attr("class", "brush")
        .call(brush)

    const listeners = {"brushed": null};

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert))
        }
    }

    function brushended(event) {
        if (!event.selection) {
            listeners["brushed"](null)
        }
    }
        
    function update(data) {

        xScale.domain(d3.extent(data, d => d.date))
        yScale.domain(d3.extent(data, d => d.total))

        const area = d3.area()
            .x(d => xScale(d.date))
            .y0(() => yScale.range()[0])
            .y1(d => yScale(d.total))

        svg.selectAll('.path')
            .datum(data)
            .attr("fill", "steelblue")
            .attr("d", area)

        svg.selectAll(".axis.x-axis")
            .call(xAxis)

        svg.selectAll(".axis.y-axis")
            .call(yAxis)
    }
    function on(event, listener) {
        listeners[event] = listener
    }
    return {
        update,
        on
    }
}