import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef, useState} from "react";
import {axisBottom, axisLeft, drag, select} from "d3";
/* eslint-disable semi */

export const Axis = (props: { svgRef: React.RefObject<SVGSVGElement>, axisProps: graphingTypes.axisProps }) => {
	const axisRef = useRef(null),
		titleRef = useRef(null),
		scale = props.axisProps.scaleLinear,
		[min, max] = scale.range(),
		[domain, setDomain] = [props.axisProps.domain, props.axisProps.setDomain],
		[bbox, setBbox] = useState({x:0, y:0, width: 0, height: 0})

	const axis = props.axisProps.orientation === 'bottom' ? axisBottom : axisLeft

	useEffect(() => {

		function onDragStart(event: any, d: any) {
			select(this)
				.attr('cursor', 'grabbing')
		}

		function onDrag(event: { dx: number; dy: number; }, d: any) {
			const delta = -(props.axisProps.orientation === 'bottom' ? event.dx : event.dy)
			if (delta !== 0) {
				const scaleDomain = scale.domain(),
					worldDelta = scale.invert(delta) - scale.invert(0)
				setDomain([scaleDomain[0] + worldDelta, scaleDomain[1] + worldDelta])
				scale.domain([scaleDomain[0] + worldDelta, scaleDomain[1] + worldDelta])
			}
		}

		function onDragEnd() {
			select(this)
				.attr('cursor', 'grab')
		}

		if (axisRef?.current) {
			const dragBehavior = drag()
					.on("start", onDragStart)
					.on("drag", onDrag)
					.on("end", onDragEnd),
				theAxis = select(axisRef.current)
					.attr("transform", props.axisProps.transform)
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					.call(axis(scale))

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			setBbox(axisRef.current.getBBox())

			const tLength = props.axisProps.length !== undefined ? props.axisProps.length : 0
			theAxis
				.selectAll('.dragRect')
				.data([tLength])
				.join(
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					(enter) => {
						enter.append('rect')
							.attr('class', 'dragRect')
							.call(dragBehavior)
					},
					(update) => {
						update
							.attr('x', bbox.x)
							.attr('y', bbox.y)
							.attr('width', bbox.width)
							.attr('height', bbox.height)
							.attr(props.axisProps.orientation === 'bottom' ? 'width' : 'height', tLength)
					}
				)
		}
	}, [props.axisProps.transform, axis, scale, domain, setDomain, min, max,
		props.axisProps.length, props.axisProps.orientation, bbox.x, bbox.y, bbox.width, bbox.height])

	// Title
	useEffect(() => {
		const tX = (props.axisProps.orientation === 'bottom') ? (max - min)/2 : (max - min)/2,
			tY = props.axisProps.orientation === 'bottom' ? bbox.height + 10 : bbox.x - 5,
			tRotation = props.axisProps.orientation === 'bottom' ? '' : 'rotate(-90)'
		select(titleRef.current)
			.selectAll('text.axis-title')
			.data([1])
			.join(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(enter) => {
					enter.append('text')
						.attr('class', 'axis-title')
						.attr('text-anchor', 'middle')
						.text('Axis Title')
				},
				(update) => {
					update
						.attr('transform', props.axisProps.transform + ' ' + tRotation)
						.attr('x', tX)
						.attr('y', tY)
				})

	}, [max, min, bbox.x, bbox.y, bbox.width, bbox.height, props.axisProps.transform, props.axisProps.orientation])

	return (
		<g>
			<g className='axis' ref={axisRef}/>
			<g ref={titleRef}></g>
		</g>
	)
}

/* eslint-enable semi */
