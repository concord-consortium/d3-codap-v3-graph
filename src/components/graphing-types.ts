import {ScaleLinear} from "d3";

export namespace graphingTypes {
	export type axisProps = {
		orientation:'bottom' | 'left' | 'right' | 'top',
		scaleLinear:ScaleLinear<number, number>,
		domain: number[],
		setDomain: any,
		transform: string,
		length: number | undefined
	}

	export type worldData = {
		x: number, y:number, selected: boolean, caseID: number
	}

	export type scatterDotsProps = {
		scatterData:worldData[],
		xScale:any,
		yScale:any,
		xDomain:number[],
		yDomain:number[],
		transform: string
	}

}