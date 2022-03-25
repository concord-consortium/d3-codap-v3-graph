import {graphingTypes} from "./graphing-types";
import React, {useEffect, useRef} from "react";
import {axisBottom, axisLeft, select} from "d3";
/* eslint-disable semi */

export const Axis = (props: { svgRef: React.RefObject<SVGSVGElement>, axisProps: graphingTypes.axisProps })=> {
	const ref = useRef(null),
		[min, max] = props.axisProps.scaleLinear.range()
	let axis: any
	switch (props.axisProps.orientation) {
		case "bottom":
			axis = axisBottom
			break
		case 'left':
			axis = axisLeft
	}
	useEffect(() => {
		select(ref.current)
			.attr("transform", props.axisProps.transform)
			.call(axis(props.axisProps.scaleLinear))
	},[props.axisProps.transform, axis, props.axisProps.scaleLinear, min, max])
	return (
		<g className='axis' ref={ref}/>
	)
}

/* eslint-enable semi */
