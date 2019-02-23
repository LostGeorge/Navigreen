import {fetch} from 'wix-fetch';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import {getResults} from 'backend/backend.jsw';


$w.onReady( function () {

    $w("#dataset1").onReady( async () => {
        await deleteAll($w);
    });

    $w("#dataset2").onReady( async () => {
        await deleteAll($w);
    });

    $w("#button5").onClick( async () => {
        let locs = await $w("#dataset1").getCurrentItem();
        var startLoc = locs.startLocation;
        var destLoc = locs.destination; 
        var res = await getResults(startLoc, destLoc);
	    console.log(res);


        let toInsert = await {
            "driveTime": res.results[0].time,
            "driveCarbon": res.results[0].carbon,
            "bikeTime": res.results[1].time,
            "bikeCarbon": res.results[1].carbon,
            "walkTime": res.results[2].time,
            "walkCarbon": res.results[2].carbon,
            "transitTime": res.results[3].time,
            "transitCarbon": res.results[3].carbon
        };
        wixData.insert("Results", toInsert)
            .then( (results) => {
		        let item = results; //see item below
	        } )
	        .catch( (err) => {
		        let errorMsg = err;
        } );
        wixLocation.to("/results");
    });
});

