import 'backend/backend.jsw';

$w.onReady( function () {
    if ($w("#html1").rendered) {
        $w("#html1").hide()
    }
    if ($w("#html2").rendered) {
        $w("#html2").hide()
    }
    if ($w("#html3").rendered) {
        $w("#html3").hide()
    }
    if ($w("#html4").rendered) {
        $w("#html4").hide()
    }
    
    $w("#button4").onClick( async () => {
        await $w("#html2").hide("fade");
        await $w("#html3").hide("fade");
        await $w("#html4").hide("fade");
        $w("#html1").show("fade");
        
    });

    $w("#button3").onClick( async () => {
        await $w("#html1").hide("fade");
        await $w("#html3").hide("fade");
        await $w("#html4").hide("fade");
        $w("#html2").show("fade");
    });

    $w("#button2").onClick( async () => {
        await $w("#html1").hide("fade");
        await $w("#html2").hide("fade");
        await $w("#html4").hide("fade");
        await $w("#html3").show("fade");
    });

    $w("#button1").onClick( async () => {
        await $w("#html1").hide("fade");
        await $w("#html2").hide("fade");
        await $w("#html3").hide("fade");
        $w("#html4").show("fade");
    });
});