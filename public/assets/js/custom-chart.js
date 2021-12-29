/*--------------  ad statistics and user bars start ------------*/
if ($('.ad-statistics').length || $('.users-bar').length) {
    // Get Chart Containers
	var $dashChartBarsCnt3 = $( '.users-bar' )[0].getContext( '2d'),
        $dashChartLinesCnt4 = $( '.ad-statistics' )[0].getContext( '2d' );

	// Set global chart options
	var $globalOptions = {
		showScale: false,
		tooltipCornerRadius: 2,
		maintainAspectRatio: false,
		responsive: true,
		animation: false,
		pointDotStrokeWidth: 2
	};

    // Init Lines Chart Bars
	$dashChartBars3 = new Chart( $dashChartBarsCnt3 ).Bar( $dashChartLinesData3, {
		scaleBeginAtZero: true,
		scaleShowVerticalLines: false,
		barShowStroke: false,
		scaleFontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
		scaleFontColor: 'gray',
		tooltipTitleFontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
		tooltipCornerRadius: 2,
		maintainAspectRatio: false,
		responsive: true,
		animation: false
	});

    // Init Lines Chart 4
    $dashChartLines4 = new Chart( $dashChartLinesCnt4 ).Line( $dashChartLinesData4, {
        scaleBeginAtZero: true,
		scaleShowHorizontalLines: false,
		bezierCurve: false,
		datasetFill: false,
		pointDotStrokeWidth: 2,
		scaleFontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
		scaleFontColor: 'gray',
		scaleFontStyle: '500',
		tooltipTitleFontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
		tooltipCornerRadius: 2,
		maintainAspectRatio: false,
		responsive: true,
		animation: false
    });
}
/*--------------  ad statistics and user bars end ------------*/
