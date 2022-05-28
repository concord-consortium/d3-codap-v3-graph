import {graphingTypes} from "../components/graphing-types";
import worldRect = graphingTypes.worldRect;
import worldData = graphingTypes.worldData;
/* eslint-disable semi */

/**
 * Utility routines having to do with data
 */

export function between(x:number, min:number, max:number) {
	return min <= x && x <= max
}

export function selectCasesInWorldRect( iData:worldData[], iWorldRect:worldRect) {
	const tRight = iWorldRect.x + iWorldRect.width,
		tBottom = iWorldRect.y - iWorldRect.height
	// console.log(`y: ${iWorldRect.y}; height: ${iWorldRect.height}; bottom: ${tBottom}`)
	// console.log(`x = ${iWorldRect.x}; y = ${iWorldRect.y}; tRight = ${tRight}; tBottom = ${tBottom}`)
	return iData.map((d)=>{
		d.selected = between(d.x, iWorldRect.x, tRight) && between(d.y, tBottom, iWorldRect.y)
		return d
	})
}

/* eslint-enable semi */
