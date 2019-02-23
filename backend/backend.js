import {getJSON} from 'wix-fetch';
import wixData from 'wix-data';
import {session} from 'wix-storage';

const KEY = "AIzaSyDPsrx9y86GMChz-S_Frggz2ZfJIdnPzlg";

/**
export async function getCoords(address) {
    let query = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + KEY)
    var lat = query.results.geometry.location.lat;
    var long = query.results.geometry.location.long;
    return [lat,long];
}
**/

export async function getResults(fromLoc, toLoc) {
    var results = {results: []};
    let driveQuery = await getJSON("https://maps.googleapis.com/maps/api/directions/json?"
                             + "origin=" + fromLoc + "&destination=" + toLoc + "&key=" + KEY);
    if (driveQuery.status === "OK") {
        let time = await getTime(driveQuery);
        let strTime = await convertTime(time);
        let carbon = Math.round(await getCarbon(driveQuery));
        var driveObj = {type: "Driving", time: strTime, carbon: carbon};
        results.results.push(driveObj);
        let startLat = driveQuery.routes[0].legs[0].steps[0].start_location.lat;
        let startLong = driveQuery.routes[0].legs[0].steps[0].start_location.long;
        session.setItem("driveLat", startLat.toString());
        session.setItem("driveLong", startLong.toString());
    }
    let bikeQuery = await getJSON("https://maps.googleapis.com/maps/api/directions/json?"
                             + "origin=" + fromLoc + "&destination=" + toLoc + "&mode=bicycling" + "&key=" + KEY);
    if (bikeQuery.status === "OK") {
        let time = await getTime(bikeQuery);
        let strTime = await convertTime(time);
        var bikeObj = {type: "Biking", time: strTime, carbon: 0};
        results.results.push(bikeObj);
        let startLat = bikeQuery.routes[0].legs[0].steps[0].start_location.lat;
        let startLong = bikeQuery.routes[0].legs[0].steps[0].start_location.long;
        session.setItem("bikeLat", startLat.toString());
        session.setItem("bikeLong", startLong.toString());
    }
    let walkQuery = await getJSON("https://maps.googleapis.com/maps/api/directions/json?"
                             + "origin=" + fromLoc + "&destination=" + toLoc + "&mode=walking" + "&key=" + KEY);
    if (walkQuery.status === "OK") {
        let time = await getTime(walkQuery);
        let strTime = await convertTime(time);
        var walkObj = {type: "Walking", time: strTime, carbon: 0};
        results.results.push(walkObj);
        let startLat = walkQuery.routes[0].legs[0].steps[0].start_location.lat;
        let startLong = walkQuery.routes[0].legs[0].steps[0].start_location.long;
        session.setItem("walkLat", startLat.toString());
        session.setItem("walkLong", startLong.toString());
    }
    let transitQuery = await getJSON("https://maps.googleapis.com/maps/api/directions/json?"
                             + "origin=" + fromLoc + "&destination=" + toLoc + "&mode=transit" + "&key=" + KEY);
    if (transitQuery.status === "OK") {
        let time = await getTime(transitQuery);
        let strTime = await convertTime(time);
        let carbon = Math.round(0.0882 * (await getCarbon(transitQuery)));
        var transitObj = {type: "Transit", time: strTime, carbon: carbon};
        results.results.push(transitObj);
        let startLat = driveQuery.routes[0].legs[0].steps[0].start_location.lat;
        let startLong = driveQuery.routes[0].legs[0].steps[0].start_location.long;
        session.setItem("transitLat", startLat.toString());
        session.setItem("transitLong", startLong.toString());
    }
    return results;
}

export async function getTime(query) {
    let totalTime = 0;
    for (var i = 0; i < query.routes.length; i++) {
        for (var j = 0; j < query.routes[i].legs.length; j++) {
            totalTime += await query.routes[i].legs[i].duration.value;
        }
    }
    return totalTime;
}

export async function convertTime(seconds) {
    var hours = await Math.floor(seconds / 3600);
    seconds = await seconds % 3600;
    var minutes = await Math.floor(seconds / 60);
    if (hours > 0) {
        return (hours + " hours and " + minutes + " minutes");
    }
}

export async function getCarbon(query) {
    let totalDist = 0;
    for (var i = 0; i < query.routes.length; i++) {
        for (var j = 0; j < query.routes[i].legs.length; j++) {
            totalDist += await query.routes[i].legs[i].distance.value;
        }
    }
    totalDist = totalDist / 1609.344;
    let carbon = 404 * totalDist;
    return carbon;
}

export function deleteAll($w) {
	wixData.query("Results")
	.limit(1000)
	.find()
	.then((result) => {
		for (var i = 0; i < result.items.length; i++) {
			if (result.items[i] === null) continue;
			wixData.remove("Results", result.items[i]._id);
		}
    })
}