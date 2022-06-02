import {graphingTypes} from "./graphing-types";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {format, select} from "d3";
/* eslint-disable semi */

export const ScatterDots = (props: {
	dots: graphingTypes.scatterDotsProps
}) => {
	const defaultRadius = 5,
		dragRadius = 10,
		keyFunc = (d: graphingTypes.worldData) => d.id,
		data = props.dots.scatterData,
		setData = props.dots.setScatterData,
		plotAreaSVGRef = useRef() as React.RefObject<SVGSVGElement>,
		dotsRef = useRef() as React.RefObject<SVGSVGElement>,
		xScale = props.dots.xScale,
		yScale = props.dots.yScale,
		[dragID, setDragID] = useState(-1),
		[currPos, setCurrPos] = useState({x: 0, y: 0}),
		plotX = xScale.range()[0],
		plotY = yScale.range()[1],
		plotWidth = xScale.range()[1] - xScale.range()[0],
		plotHeight = yScale.range()[0] - yScale.range()[1]

	const onDragStart = useCallback((event: MouseEvent) => {
			const element = select(event.target as SVGSVGElement),
				tItsID = Number(element.property('id'))
			if (element.node()?.nodeName === 'circle') {
				element.transition()
					.attr('r', dragRadius)
				element.raise()
				setDragID(() => tItsID)
				setCurrPos(() => {
					return {x: event.clientX, y: event.clientY}
				})
				setData(d => {
					return d.map((datum) =>
						datum.id === tItsID
							? {...datum, selected: true}
							: {...datum}
					)
				})

				element.classed('dragging', true)
			}
		}, [setData]),

		onDrag = useCallback((event: MouseEvent) => {
			if (dragID >= 0) {
				const newPos = {x: event.clientX, y: event.clientY},
					dx = newPos.x - currPos.x,
					dy = newPos.y - currPos.y
				setCurrPos(newPos)
				if (dx !== 0 || dy !== 0) {
					const deltaX = props.dots.xScale.invert(dx) - props.dots.xScale.invert(0),
						deltaY = props.dots.yScale.invert(dy) - props.dots.yScale.invert(0)
					setData(d => {
							return d.map((datum) =>
								datum.id === dragID
									? {...datum, x: datum.x += deltaX, y: datum.y += deltaY}
									: {...datum}
							)
						}
					)
				}
			}
		}, [setData, currPos, dragID, props.dots.xScale, props.dots.yScale]),

		onDragEnd = useCallback((event: MouseEvent) => {
			if (dragID >= 0) {
				select(event.target as SVGSVGElement)
					.classed('dragging', false)
					.transition()
					.attr('r', defaultRadius)
				setData(d => {
					return d.map((datum) =>
						datum.id === dragID
							? {...datum, selected: false}
							: {...datum}
					)
				})
				setDragID(() => -1)
			}
		}, [setData, dragID])

	useEffect(() => {
		// add event listeners just once
		addEventListener('mousedown', onDragStart)
		addEventListener('mousemove', onDrag)
		addEventListener('mouseup', onDragEnd)
		// On cleanup, remove event listeners
		return () => {
			removeEventListener('mousedown', onDragStart)
			removeEventListener('mousemove', onDrag)
			removeEventListener('mouseup', onDragEnd)
		}
	}, [onDragStart, onDrag, onDragEnd])

	useEffect(() => {
		const float = format('.1f')

		const delayInterval = 500 / data.length,
			dotsSvgElement = dotsRef.current

		select(plotAreaSVGRef.current)
			// .attr('transform', props.dots.transform)
			.attr('x', plotX + 60)
			.attr('y', plotY)
			.attr('width', plotWidth)
			.attr('height', plotHeight)

		select(dotsSvgElement)
			.selectAll('circle')
			.data(data, keyFunc)
			.join(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(enter) => {
					enter.append('circle')
						.attr('class', 'dot')
						// .attr('transform', props.dots.transform)
						.attr("r", defaultRadius)
						.attr('cx', xScale.range()[1] / 2)
						.attr('cy', yScale.range()[0] / 2)
						.property('id', (d: any) => d.id)
						.transition()
						.delay((d: any, i: number) => {
							return i * delayInterval
						})
						.duration(100)
						.attr("cx", (d: { x: any; }) => xScale(d.x))
						.attr("cy", (d: { y: any; }) => yScale(d.y))
						.selection()
						.append('title')
						.text((d: any) => `(${float(d.x)}, ${float(d.y)}, id: ${d.id}`)
				},
				(update) => {
					update.classed('dot-highlighted',
						(d: { selected: boolean }) => (d.selected))
						.attr('cx', (d: { x: any; }) => xScale(d.x))
						.attr('cy', (d: { y: any; }) => yScale(d.y))
						.select('title')
						.text((d: any) => `(${float(d.x)}, ${float(d.y)}, id: ${d.id}`)
				},
				(exit) => {
					exit.transition()
						.attr('r', 0)
						.remove()
				}
			)
	}, [onDragStart, onDrag, onDragEnd,
		data, props.dots.transform, props.dots, xScale, yScale, plotX, plotY, plotWidth, plotHeight])

	return (
			<svg ref={plotAreaSVGRef} className='plotArea'>
				<svg ref={dotsRef} />
			</svg>
	)
}

/* eslint-enable semi */
