import React, {useRef} from "react";
import {
	scaleLinear, range, extent, randomNormal, randomUniform
} from "d3";
import {useResizeDetector} from 'react-resize-detector';
import {graphingTypes} from "./graphing-types";
import {Axis} from "./axis";
import {ScatterDots} from "./scatterplot";

import "./app.scss";
/* eslint-disable semi */

const
	playData: graphingTypes.worldData[] = range(1000).map((n) => {
		return {
/*
			x: n,
			y: n,
*/
			x: randomUniform(0, 200)(),
			y: randomNormal(10, 2)(),
			caseID: n,
			selected: false
		}
	}),
	margin = ({top: 10, right: 30, bottom: 30, left: 60}),
	x = scaleLinear(),
	y = scaleLinear()

export function App() {

	const
		svgRef = useRef() as React.RefObject<SVGSVGElement>,
		{width, height, ref} = useResizeDetector(),
		dotsProps: graphingTypes.scatterDotsProps = {
			scatterData: playData,
			xScale: x,
			yScale: y,
			transform: `translate(${margin.left}, 0)`
		}

	x.domain(extent(playData, d => d.x) as [number, number]).nice()
		.range([0, 0.8 * (width || 300)])
	y.domain(extent(playData, d=>d.y) as [number, number]).nice()
		.range([0.8 * (height || 500), 0])

	return (
		<div className='app' ref={ref}>
			<h3> Drawing with d3 </h3>
			<svg className='d3Drawing' ref={svgRef}>
				<Axis svgRef={svgRef}
							axisProps={
								{
									orientation: 'left',
									scaleLinear: y,
									transform: `translate(${margin.left}, 0)`
								}
							}
				/>
				<Axis svgRef={svgRef}
							axisProps={
								{
									orientation: 'bottom',
									scaleLinear: x,
									transform: `translate(${margin.left}, ${0.8 * (height || 500)})`
								}
							}
				/>
				{ height !== undefined && width !== undefined ? (
					<ScatterDots
						svgRef={svgRef}
						dots={dotsProps}/>
				) : ''}
			</svg>
		</div>
	)
}

/* eslint-enable semi */
