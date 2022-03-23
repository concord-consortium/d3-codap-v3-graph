export namespace graphingTypes {
	export type axisProps = {
		orientation:'bottom' | 'left' | 'right' | 'top',
		scaleLinear:any,
		transform: string
	}

	export type worldData = {
		x: number, y:number, selected: boolean, caseID: number
	}

	export type scatterDotsProps = {
		scatterData:worldData[],
		xScale:any,
		yScale:any,
		transform: string
	}

}