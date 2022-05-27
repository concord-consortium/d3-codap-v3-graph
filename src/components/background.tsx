import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef} from "react";
import {drag, select, Selection} from "d3";
// import {selectCasesInWorldRect} from "../utils/data_utils";
/* eslint-disable semi */

export const Background = (props: {
	dots: graphingTypes.scatterDotsProps
}) => {
	const ref = useRef() as React.RefObject<SVGSVGElement>,
		xScale = props.dots.xScale,
		yScale = props.dots.yScale,
		plotX = xScale.range()[0],
		plotY = yScale.range()[1],
		plotWidth = xScale.range()[1] - xScale.range()[0],
		plotHeight = yScale.range()[0] - yScale.range()[1]

	useEffect(() => {
		let dragRect: Selection<SVGRectElement, unknown, null, undefined> | null,
			startX: number,
			startY: number,
			width: number,
			height: number

		function onDragStart(event: MouseEvent) {
			startX = event.x
			startY = event.y
			width = 0
			height = 0
			dragRect = select(groupElement).append('rect')
				.attr('class', 'marquee')
				.attr('x', startX)
				.attr('y', startY)
				.attr('width', 0)
				.attr('height', 0)
		}

		function onDrag(event: { dx: number; dy: number; }) {
			if( event.dx !== 0 || event.dy !== 0) {
				width += event.dx
				height += event.dy
				dragRect?.attr('x', width < 0 ? startX + width : startX)
					.attr('y', height < 0 ? startY + height : startY)
					.attr('width', Math.abs(width))
					.attr('height', Math.abs(height))

/*
				props.dots.setScatterData(
					selectCasesInWorldRect(props.dots.scatterData,
						{
							x: props.dots.xScale.invert(dragRect?.attr('x')),
							y: props.dots.yScale.invert(dragRect?.attr('y')),
							width: (props.dots.xScale.invert(dragRect?.attr('width')) - props.dots.xScale.invert(0)),
							height: (props.dots.yScale.invert(0) - props.dots.yScale.invert(dragRect?.attr('height')))
						}))
*/
			}
		}

		function onDragEnd() {
			dragRect?.remove()
			dragRect = null
		}

		const dragBehavior = drag()
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
						.call(dragBehavior)
				},
				(update) => {
					update.attr('width', plotWidth)
						.attr('height', plotHeight)
				}
			)
	}, [props.dots.transform, props.dots, xScale, yScale, plotX, plotY, plotWidth, plotHeight])

	return (
		<g ref={ref}/>
	)
}

/* eslint-enable semi */
