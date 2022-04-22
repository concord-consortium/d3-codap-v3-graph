import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef} from "react";
import {axisBottom, axisLeft, drag, select} from "d3";
/* eslint-disable semi */

export const Axis = (props: { svgRef: React.RefObject<SVGSVGElement>, axisProps: graphingTypes.axisProps }) => {
	const ref = useRef(null),
		scale = props.axisProps.scaleLinear,
		[min, max] = scale.range(),
		[domain, setDomain] = [props.axisProps.domain, props.axisProps.setDomain]

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
					// console.log(`scale.domain = ${scale.domain()}, domain state = ${domain}, scaleDomain = ${scaleDomain}`)
					setDomain([scaleDomain[0] + worldDelta, scaleDomain[1] + worldDelta])
					scale.domain([scaleDomain[0] + worldDelta, scaleDomain[1] + worldDelta])
				}
			}

			function onDragEnd() {
				select(this)
					.attr('cursor', 'grab')
			}

			if (ref?.current) {
				const dragBehavior = drag()
						.on("start", onDragStart)
						.on("drag", onDrag)
						.on("end", onDragEnd),
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					bbox = ref.current.getBBox(),
					theAxis = select(ref.current)
						.attr("transform", props.axisProps.transform)
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						.call(axis(scale))

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
		}, [props.axisProps.transform, axis, scale, domain, setDomain, min, max, props.axisProps.length, props.axisProps.orientation]
	)
	return (
		<g className='axis' ref={ref}/>
	)
}

/* eslint-enable semi */
