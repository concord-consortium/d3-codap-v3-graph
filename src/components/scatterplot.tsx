import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef, useState} from "react";
import {drag, format, select} from "d3";
/* eslint-disable semi */

export const ScatterDots = (props: {
	dots: graphingTypes.scatterDotsProps
}) => {
	const defaultRadius = 5,
		dragRadius = 10,
		keyFunc = (d: graphingTypes.worldData) => d.caseID,
		[data, setData] = useState(props.dots.scatterData),
		ref = useRef() as React.RefObject<SVGSVGElement>,
		xScale = props.dots.xScale,
		yScale = props.dots.yScale,
		plotX = xScale.range()[0],
		plotY = yScale.range()[1],
		plotWidth = xScale.range()[1] - xScale.range()[0],
		plotHeight = yScale.range()[0] - yScale.range()[1]

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

			select(ref.current)
				.attr('class', 'dragging')
		}

		function onDrag(event: { dx: number; dy: number; }, d: any) {
			if (event.dx !== 0 || event.dy !== 0) {
				const deltaX = props.dots.xScale.invert(event.dx) - props.dots.xScale.invert(0),
					deltaY = props.dots.yScale.invert(event.dy) - props.dots.yScale.invert(0)
				// console.log(`dx = ${event.dx}; deltaX = ${deltaX}; d.x = ${d.x}`)
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
				.on("end", onDragEnd),
			groupElement = ref.current

		select(groupElement)
			.selectAll('rect')
			.data([1])
			.join(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(enter) => {
					enter.append('rect')
						.attr('class', 'dots')
						.attr('transform', props.dots.transform)
						.attr('x', plotX)
						.attr('y', plotY)
						.attr('width', plotWidth)
						.attr('height', plotHeight)
				},
				(update) =>{
					update.attr('width', plotWidth)
						.attr('height', plotHeight)
				}
			)

		select(groupElement)
			.selectAll('circle')
			.data(data, keyFunc)
			.join(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(enter) => {
					enter.append('circle')
						.attr('class', 'dot')
						.attr('transform', props.dots.transform)
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
	}, [data, props.dots.transform, props.dots, xScale, yScale, plotX, plotY, plotWidth, plotHeight])

	return (
		<g ref={ref}/>
	)
}

/* eslint-enable semi */
