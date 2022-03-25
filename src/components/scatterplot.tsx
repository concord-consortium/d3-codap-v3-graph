import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef, useState} from "react";
import {drag, format, select} from "d3";
/* eslint-disable semi */

export const ScatterDots = (props: {
	svgRef: React.RefObject<SVGSVGElement>, dots: graphingTypes.scatterDotsProps
}) => {
	const xScale = props.dots.xScale,
		yScale = props.dots.yScale,
		defaultRadius = 5,
		dragRadius = 10,
		keyFunc = (d: graphingTypes.worldData) => d.caseID,
		[data, setData] = useState(props.dots.scatterData),
		ref = useRef() as React.RefObject<SVGSVGElement>

	useEffect(() => {
		const float = format('.1f')
		let dragID = -1

		function onDragStart(event: any, d: any) {
			const element = select(this)
			element.transition()
				.attr('r', dragRadius)
			element.raise()
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
				.on("start", onDragStart)
				.on("drag", onDrag)
				.on("end", onDragEnd)
		select(ref.current)
			.selectAll('circle')
			.data(data, keyFunc)
			.join(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(enter) => {
					enter.append('circle')
						.attr('class', 'dot')
						.attr('transform', props.dots.transform)
						.attr('class', 'dot')
						.attr("r", defaultRadius)
						.attr('cx', xScale.range()[1] / 2)
						.attr('cy', yScale.range()[0] / 2)
						.property('caseID', (d: any) => d.caseID)
						.transition()
						.delay((d: any, i: number) => {
							return i * delayInterval
						})
						.duration(1000)
						.attr("cx", (d: { x: any; }) => xScale(d.x))
						.attr("cy", (d: { y: any; }) => yScale(d.y))
						.selection()
						.append('title')
						.text((d: any) => `(${float(d.x)}, ${float(d.y)}, caseID: ${d.caseID}`)

					enter
						.selectAll('.dot')
						.call(dragBehavior)
				},
				(update) => {
					update.classed('dot-highlighted', (d: { selected: boolean }) => (d.selected))
						.attr('cx', (d: { x: any; }) => xScale(d.x))
						.attr('cy', (d: { y: any; }) => yScale(d.y))
						.select('title')
						.text((d: any) => `(${float(d.x)}, ${float(d.y)}, caseID: ${d.caseID}`)
				},
				(exit) => {
					exit.transition()
						.attr('r', 0)
						.remove()
				}
			)
	}, [data, xScale, yScale, props.dots.transform, props.svgRef])

	return (
		<g className='dots' ref={ref}/>
	)
}

/* eslint-enable semi */
