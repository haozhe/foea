
var dataView;
var areaChart;
function drawVisualization() {
	var query = new google.visualization.Query("http://docs.google.com/spreadsheet/tq?key=0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c&transpose=0&headers=1&range=A1%3AU9&gid=0&pub=1");

	query.send(handleQueryResponse);



}


function handleQueryResponse(response){
	if(response.isError()) {
		alert("error");
		return;
	} 
	var data = response.getDataTable();

	dataView = new google.visualization.DataView(data);



 		 // Create and draw the visualization.

 		 areaChart = new google.visualization.AreaChart(document.getElementById('chart'));

 		 options = {
 		 	title : 'Produce Graph',
 		 	isStacked: true,
 		 	width: 960,
 		 	height: 600,
 		 	vAxis: {title: "Produce Poundage"},
 		 	hAxis: {title: "Month"}

 		 };

 		 dataView.setColumns([0, 1]);
 		 dataView.setRows([0, 1, 2, 3, 4, 5, 6, 7]);
 		 draw();
 		 //new google.visualization.Dashboard(document.getElementById("dashboard")).
 		 //bind(producePicker, areaChart).draw(dataView);

 }

 		google.setOnLoadCallback(drawVisualization);

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

	$(".download").on("click", screenshot);
		 			var vegetables = [0, 1];
		 			var months = [0, 1, 2, 3, 4, 5, 6, 7];

			//Code to generate vegatable checkboxed
			$.ajax({
				url:"https://spreadsheets.google.com/feeds/cells/0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c/od6/public/basic?range=B1%3AU1&alt=json",
				type:"get",
				success: function (json) {
					entryList = json.feed.entry;
					var checkboxList = "";
					for (var i = 0; i < entryList.length; i++){
						checkboxList += '<li class="rows"><input type="checkbox" value="'+(i+1)+'"id="veg'+(i+1)+'" /><label for="veg'+(i+1)+'">'+ entryList[i].content.$t +'</label></li>';
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
				url:"https://spreadsheets.google.com/feeds/cells/0AtN3-Cxg0tC7dC1SSjlqUG54bFJkNjBhUHRwZ0hXX2c/od6/public/basic?range=A2%3AA9&alt=json",
				type:"get",
				success:function (json){
					entryList = json.feed.entry;
					var checkboxList= "";
					for (var i = 0; i< entryList.length; i++){
						checkboxList += '<li class="rows"><input type="checkbox" value="'+i+'" id="month'+i+'" checked="true"/><label for="month'+i+'">'+ entryList[i].content.$t +'</label></li>';	
					}

					

					$("#chart-control #time-control ul.lists").html(checkboxList);

						//Code to check which checkboxes are checked
						$("#chart-control #time-control ul.lists li input").on("click",function (){
							console.log("checkbox clicked");
							var checkedCheckboxList = $("#chart-control #time-control ul.lists li input:checked");
							console.log(checkedCheckboxList);

							//Clear current months array
							months = [];
							for (var i = 0; i < checkedCheckboxList.length; i++){
								months.push(checkedCheckboxList[i].value);
								// console.log(checkedCheckboxList[i].value);
							}
							console.log(months);
							redraw(vegetables, months);
							// console.log($("#chart-control #vegatable-control ul.lists li input:checked").length);
						// console.log($("#chart-control #vegatable-control ul.lists li input:checked"));

					});

					}
				});

});
