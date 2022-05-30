import {ScaleLinear} from "d3";
import {Dispatch, SetStateAction} from "react";

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
		x: number, y:number, selected: boolean, id: number
	}

	export type worldRect = {
		x:number, y:number, width:number, height:number
	}

	export type scatterDotsProps = {
		scatterData:worldData[],
		setScatterData: Dispatch<SetStateAction<worldData[]>>,
		xScale:any,
		yScale:any,
		xDomain:number[],
		yDomain:number[],
		transform: string
	}

	export type pixelRect = {
		x:number, y:number, width:number, height:number
	}


}