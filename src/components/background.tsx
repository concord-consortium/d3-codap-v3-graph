import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef} from "react";
import {drag, select} from "d3";
import {selectCasesInWorldRect} from "../utils/data_utils";
// import {selectCasesInWorldRect} from "../utils/data_utils";
/* eslint-disable semi */

export const Background = (props: {
	dots: graphingTypes.scatterDotsProps,
	marquee: { rect: graphingTypes.pixelRect,
						setRect:  React.Dispatch<React.SetStateAction<graphingTypes.pixelRect>> }
}) => {
	const ref = useRef() as React.RefObject<SVGSVGElement>,
		xScale = props.dots.xScale,
		yScale = props.dots.yScale,
		plotX = xScale.range()[0],
		plotY = yScale.range()[1],
		plotWidth = xScale.range()[1] - xScale.range()[0],
		plotHeight = yScale.range()[0] - yScale.range()[1]

	useEffect(() => {
		let startX: number,
			startY: number,
			width: number,
			height: number

		function onDragStart(event: MouseEvent) {
			startX = event.x
			startY = event.y
			width = 0
			height = 0
			props.marquee.setRect({x: event.x, y: event.y, width: 0, height: 0})
		}

		function onDrag(event: { dx: number; dy: number; }) {
			if (event.dx !== 0 || event.dy !== 0) {
				width += event.dx
				height += event.dy
				props.marquee.setRect({ x:startX, y:startY, width, height })

				const worldRect = {
					// todo: extract translation from transform
					x: props.dots.xScale.invert((width < 0 ? startX + width : startX) - 60),
					y: props.dots.yScale.invert(height < 0 ? startY + height : startY),
					width: (props.dots.xScale.invert(Math.abs(width)) - props.dots.xScale.invert(0)),
					height: (props.dots.yScale.invert(0) - props.dots.yScale.invert(Math.abs(height)))
				}

				props.dots.setScatterData(
					selectCasesInWorldRect(props.dots.scatterData, worldRect))
			}
		}

		function onDragEnd() {
			props.marquee.setRect({ x: 0, y: 0, width: 0, height: 0 })
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
	}, [props.dots.transform, props.dots, props.marquee, xScale, yScale, plotX, plotY, plotWidth, plotHeight])

	return (
		<g>
			<g ref={ref}/>
		</g>
	)
}

/* eslint-enable semi */
