
var dataView;
var areaChart;
function drawVisualization() {
	var query = new google.visualization.Query("http://docs.google.com/spreadsheet/tq?key=0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c&transpose=0&headers=1&gid=0&pub=1");

	query.send(handleQueryResponse);

}

//Function to turn column count in number into that in alphabets
function getAlphabetsForCol(colCount){
	var alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = "";
	var residue = colCount % 26;
	result = alphabets[residue - 1];

	var divideResult = Math.floor(colCount / 26);

	console.log(divideResult);
	if(divideResult){
		result = alphabets[divideResult - 1] + result;
	}
	return result;
}

function handleQueryResponse(response){
	if(response.isError()) {
		alert("error");
		return;
	};
	var data = response.getDataTable();

	dataView = new google.visualization.DataView(data);



 		 // Create and draw the visualization.

 		 areaChart = new google.visualization.AreaChart(document.getElementById('chart'));

 		 options = {
 		 	title : 'Produce Graph',
 		 	isStacked: false,
 		 	width: 960,
 		 	height: 600,
 		 	vAxis: {title: "Produce Poundage"},
 		 	hAxis: {title: "Month"}

 		 };

 		 dataView.setColumns([0, 1]);
 		 // dataView.setRows([0, 1, 2, 3, 4, 5, 6, 7]);
 		 draw();

 		}


 		function redraw(columns, rows){
 			// var columns = $('#columns').val();
 			// columns.unshift(0);
 			$(columns).each(function (i){
 				columns[i] = parseInt(columns[i]);
 			});

 			// var rows = $('#rows').val();
 			//rows[0] = 0;
 			$(rows).each(function (i){
 				rows[i] = parseInt(rows[i]);
 			});

 			console.log(columns);
 			console.log(rows);
 			dataView.setColumns(columns);
 			dataView.setRows(rows);
 			draw();
 		}

 		function draw() {


 			areaChart.draw(dataView, options);

 			//areaChart.draw(dataView);
 		}

 		function screenshot(){
 			console.log("screenshot taken");


 			var chart = $("div#chart div div")[0];
 			var chart_svg = chart.innerHTML;
 			console.log(chart_svg);
 			canvas = document.getElementById("screenshot");
 			canvas.setAttribute('width', chart_svg.offsetWidth);
 			canvas.setAttribute('height', chart_svg.offsetHeight);

 			canvg(canvas, chart_svg);
 			image_data_uri = canvas.toDataURL("image/png");
 			console.log(image_data_uri);

 			image_data_uri.replace("image/png","image/octet-stream");

 			console.log(image_data_uri);
		 	// document.location.href= image_data_uri;
		 	window.open(image_data_uri);
		 }


		 $(document).ready(function (){

		 	google.setOnLoadCallback(drawVisualization);

		 	var rowCount = 0;
		 	var colCount = 0;

		 	$(".download").on("click", screenshot);
		 	var vegetables = [0, 1];
		 	// var months = [0, 1, 2, 3, 4, 5, 6, 7];
		 	var months = [];


		 	//Code to get row count and column count
		 	$.ajax({
		 		url: "https://spreadsheets.google.com/feeds/cells/0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c/od6/public/basic?alt=json",
		 		type:"get",
		 		success: function (json) {
		 			var entryList = json.feed.entry;
		 			var lastEntryURL = entryList[json.feed.entry.length - 1].id.$t;
		 			var lastEntryURLArray = lastEntryURL.split("/R");
		 			var id = lastEntryURLArray[lastEntryURLArray.length - 1];
		 			console.log(id);
		 			var idArray = id.split("C");
		 			rowCount = idArray[0];
		 			colCount = idArray[1];

		 			console.log("row: "+rowCount +", col: " + getAlphabetsForCol(colCount));

		 			setControls(getAlphabetsForCol(colCount), rowCount, vegetables, months);
		 		}
		 	});


		 });

		 function setControls(col, row, vegetables, months){
			//Code to generate vegatable checkboxed
			$.ajax({
				url:"https://spreadsheets.google.com/feeds/cells/0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c/od6/public/basic?range=B1%3A"+col+"1&alt=json",
				type:"get",
				success: function (json) {
					var entryList = json.feed.entry;
					var checkboxList = "";
					for (var i = 0; i < entryList.length; i++){
						checkboxList += '<li class="rows"><input type="checkbox" class="regular-checkbox" value="'+(i+1)+'"id="veg'+(i+1)+'" /><label for="veg'+(i+1)+'">'+ entryList[i].content.$t +'</label></li>';
					}

					$("#chart-control #vegatable-control ul.lists").html(checkboxList);

					//Set checkbox #1 to be checked					
					$("#chart-control #vegatable-control ul.lists li:first-child input").prop("checked", "checked");

						//Code to check which checkboxes are checked
						$("#chart-control #vegatable-control ul.lists li input").on("click",function (){
							console.log("checkbox clicked");
							var checkedCheckboxList = $("#chart-control #vegatable-control ul.lists li input:checked");
							console.log(checkedCheckboxList);
							
							vegetables = [0];
							for (var i = 0; i < checkedCheckboxList.length; i++){
								vegetables.push(checkedCheckboxList[i].value);

							}
							console.log(vegetables);
							console.log(months);
							redraw(vegetables, months);

						});
					}
				});

				// Code to generate month checkboxed
				$.ajax({
					url:"https://spreadsheets.google.com/feeds/cells/0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c/od6/public/basic?range=A2%3AA"+row+"&alt=json",
					type:"get",
					success:function (json){
						var entryList = json.feed.entry;

						var sliderTabs = new Array();
					// var checkboxList= "";
					for (var i = 0; i< entryList.length; i++){
						sliderTabs.push({text: entryList[i].content.$t});

						// checkboxList += '<li class="rows"><input type="checkbox" class="regular-checkbox" value="'+i+'" id="month'+i+'" checked="true"/><label for="month'+i+'">'+ entryList[i].content.$t +'</label></li>';	
					}

		// create the slider
		( new Razorfish.Slider( {
			width : 960
			, handleWidth : 12
			,    useRange : true
			,        tabs : sliderTabs
		} ) )
		.prependTo( "div#slider-container")
		.bind     ( 'range', changeRange )
		.setRange ( 0,  entryList.length - 1);


		function changeRange( ev, min, max ){
			min = Math.floor(min);
			max = Math.floor(max);

			//Get months as array
			months = [];
			for(var i = min; i <= max; i++){
				months.push(i);
			}

			redraw(vegetables, months);

		}

		// $("#chart-control #time-control ul.lists").html(checkboxList);

						//Code to check which checkboxes are checked
					// 	$("#chart-control #time-control ul.lists li input").on("click",function (){
					// 		console.log("checkbox clicked");
					// 		var checkedCheckboxList = $("#chart-control #time-control ul.lists li input:checked");
					// 		console.log(checkedCheckboxList);

					// 		//Clear current months array
					// 		months = [];
					// 		for (var i = 0; i < checkedCheckboxList.length; i++){
					// 			months.push(checkedCheckboxList[i].value);
					// 			// console.log(checkedCheckboxList[i].value);
					// 		}
					// 		console.log(months);
					// 		redraw(vegetables, months);
					// 		// console.log($("#chart-control #vegatable-control ul.lists li input:checked").length);
					// 	// console.log($("#chart-control #vegatable-control ul.lists li input:checked"));

					// });

}
});
}
