import React, {useRef, useState} from "react";
import {
	scaleLinear, range, extent, randomNormal
} from "d3";
import {useResizeDetector} from 'react-resize-detector';
import {graphingTypes} from "./graphing-types";
import {Axis} from "./axis";
import {ScatterDots} from "./scatterdots";

import "./app.scss";
import {Background} from "./background";
import {Marquee} from "./marquee";
/* eslint-disable semi */

const
	playData: graphingTypes.worldData[] = range(1000).map((n) => {
		return {
			x: n,
			y: randomNormal(10, 2)(),
			id: n,
			selected: false
		}
	}),
	margin = ({top: 10, right: 30, bottom: 30, left: 60}),
	x = scaleLinear()
		.domain(extent(playData, d => d.x) as [number, number]).nice(),
	y = scaleLinear()
		.domain(extent(playData, d => d.y) as [number, number]).nice()

export function App() {

	const
		svgRef = useRef() as React.RefObject<SVGSVGElement>,
		{width, height, ref} = useResizeDetector(),
		tWidth = 0.8 * (width || 300),
		tHeight = 0.8 * (height || 500)

	x.range([0, tWidth])
	y.range([tHeight, 0])

	const [xDomain, setXDomain] = useState(x.domain()),
		[yDomain, setYDomain] = useState(y.domain()),

		[data, setData] = useState(playData),

	dotsProps: graphingTypes.scatterDotsProps = {
			scatterData: data,
			setScatterData: setData,
			xScale: x,
			yScale: y,
			xDomain,
			yDomain,
			transform: `translate(${margin.left}, 0)`
		},
		[marqueeRect, setMarqueeRect] = useState({x: 0, y: 0, width: 0, height: 0})

	return (
		<div className='app' ref={ref}>
			<h3> Drawing with d3 </h3>
			<svg className='d3Drawing' ref={svgRef}>
				<Axis svgRef={svgRef}
							axisProps={
								{
									orientation: 'left',
									scaleLinear: y,
									domain: yDomain,
									setDomain: setYDomain,
									transform: `translate(${margin.left}, 0)`,
									length: tHeight
								}
							}
				/>
				<Axis svgRef={svgRef}
							axisProps={
								{
									orientation: 'bottom',
									scaleLinear: x,
									domain: xDomain,
									setDomain: setXDomain,
									transform: `translate(${margin.left}, ${tHeight})`,
									length: tWidth
								}
							}
				/>
				<Background dots={dotsProps} marquee={{rect:marqueeRect, setRect: setMarqueeRect}}/>
				{height !== undefined && width !== undefined ? (
					<ScatterDots dots={dotsProps}/>
				) : ''}
				<Marquee marqueeRect={marqueeRect}/>
			</svg>
		</div>
	)
}

/* eslint-enable semi */
