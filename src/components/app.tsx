import React, {Component, useEffect, useState} from "react";
import {
	select, format, axisBottom, axisLeft, scaleLinear, min, max, range,
	selectAll, drag
} from "d3";
import {graphingTypes} from "./graphing-types";

import "./app.scss";
/* eslint-disable semi */

const kInitialDimensions = {
	width: 500,
	height: 700
}

const playData: graphingTypes.worldData[] = range(5).map((n) => {
		return {
			x: n, //randomUniform(0, 200)(),
			y: n, //randomNormal(10, 2)(),
			caseID: n,
			selected: false
		}
	}),
	xMin = (min(playData, d => d.x) || 0) - 1,
	xMax = (max(playData, d => d.x) || 20) + 1,
	yMin = (min(playData, d => d.y) || 0) - 1,
	yMax = (max(playData, d => d.y) || 20) + 1,
	margin = ({top: 10, right: 30, bottom: 30, left: 60}),
	width = 460 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom,
	x = scaleLinear()
		.domain([xMin, xMax])
		.range([0, width]),
	y = scaleLinear()
		.domain([yMin, yMax])
		.range([height, 0]),
	dotsProps: graphingTypes.scatterDotsProps = {
		scatterData: playData,
		xScale: x,
		yScale: y,
		transform: `translate(${margin.left}, 0)`
	}


class Axis extends Component<graphingTypes.axisProps, Record<string, never>> {
	ref: SVGSVGElement | null = null
	axis: any

	constructor(props: graphingTypes.axisProps) {
		super(props);
		switch (props.orientation) {
			case "bottom":
				this.axis = axisBottom
				break
			case 'left':
				this.axis = axisLeft
		}
	}

	componentDidMount() {
		select(this.ref)
			.append('g')
			.attr("transform", this.props.transform)
			.call(this.axis(this.props.scaleLinear))
	}

	render() {
		return (
			<g className='axis' ref={(ref: SVGSVGElement) => this.ref = ref}/>
		)
	}
}

function ScatterDots(dots: graphingTypes.scatterDotsProps) {
	const ref: SVGSVGElement | null = null,
		xScale = dots.xScale,
		yScale = dots.yScale,
		defaultRadius = 5,
		dragRadius = 10,
		keyFunc = (d: graphingTypes.worldData) => d.caseID,
		[data, setData] = useState(dots.scatterData)

/*
	const onDragStart = useCallback((d) => {

	}, [])
*/

	useEffect(() => {
		const float = format('.1f')
    let dragID = -1

		function onDragStart(event: any, d: any) {
			const element = select(this)
			element.transition()
				.attr('r', dragRadius)
			dragID = element.property('caseID')
      // eslint-disable-next-line @typescript-eslint/no-shadow
			setData(data => {
				return data.map((datum) =>
					datum.caseID === dragID
						? {...datum, selected: true}
						: {...datum}
				)
			})
		}

		function onDrag(event: { dx: number; dy: number; }, d: any) {
			if (event.dx !== 0 || event.dy !== 0) {
				const deltaX = xScale.invert(event.dx) - xScale.invert(0),
					deltaY = yScale.invert(event.dy) - yScale.invert(0)
        // eslint-disable-next-line @typescript-eslint/no-shadow
				setData(data => {
						return data.map((datum) =>
							datum.caseID === dragID
								? {...datum, x: datum.x += deltaX, y: datum.y += deltaY}
								: {...datum}
						)
					}
				)
			}
		}

		function onDragEnd() {
			select(this)
				.transition()
				.attr('r', defaultRadius)
		}

		const delayInterval = 500 / data.length,
			dragBehavior = drag()
				// .on("click", onDragStart)
				.on("start", onDragStart)
				.on("drag", onDrag)
				.on("end", onDragEnd),
			circles = selectAll('svg')
				.selectAll('circle')
				.data(data, keyFunc)
    circles.join(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
			(enter) => {
				enter.append('circle')
					.attr('class', 'dot')
					.attr('transform', dots.transform)
					.attr('class', 'dot')
					.attr("r", defaultRadius)
					.attr('cx', xScale.range()[1] / 2)
					.attr('cy', yScale.range()[0] / 2)
					.property('caseID', (d: any, i: number) => d.caseID)
					.transition()
					.delay((d: any, i: number) => {
						return i * delayInterval
					})
					.duration(1000)
					.attr("cx", (d: { x: any; }) => xScale(d.x))
					.attr("cy", (d: { y: any; }) => yScale(d.y))

				enter
					.selectAll('.dot')
					// .on('click', onDragStart)
					.call(dragBehavior)
			},
			(update) => {
				update.classed('dot-highlighted', (d: { selected: boolean }) => (d.selected))
					.attr('cx', (d: { x: any; }) => xScale(d.x))
					.attr('cy', (d: { y: any; }) => yScale(d.y))
					.select('title')
					.text((d: any) => `(${float(d.x)}, ${float(d.y)}, caseID: ${d.caseID}`)

				update.selectAll('dot-highlighted')
					.raise()
			},
			(exit) => {
				exit.transition()
					.attr('r', 0)
					.remove()
			}
		)
		selectAll('.dot')
			.data(data, keyFunc)
			.append('title')
			.text((d: any) => `(${float(d.x)}, ${float(d.y)}, caseID: ${d.caseID}`)

	}, [data, xScale, yScale, dots.transform])

	return (
		<g className='dots' ref={(ref: SVGSVGElement | null) => ref = ref}/>
	)
}

export const App = () => {
	return (
		<div className="app">
			<h3> Drawing with d3 </h3>

			<svg className="d3Drawing"
          width={kInitialDimensions.width}
          height={kInitialDimensions.height}
			>
				<Axis orientation={'left'}
							scaleLinear={y}
							transform={`translate(${margin.left}, 0)`}
				/>
				<Axis orientation={'bottom'}
							scaleLinear={x}
							transform={`translate(${margin.left}, ${height})`}
				/>
				<ScatterDots {...dotsProps}/>
			</svg>
		</div>
	);
};
/* eslint-enable semi */
