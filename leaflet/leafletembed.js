//set coords for each campus
var SBCoords = [-42.9033003, 147.3260722];
var SBZoom = 17;
var HCCoords = [-42.881436087205486, 147.33189582824707];
var HCZoom = 15;
var NHCoords = [-41.40346698504465, 147.12581634521484];
var NHZoom = 15;
var IRCoords = [-41.42805515303884, 147.1411371231079];
var IRZoom = 15;
var CCCoords = [-41.05068315714677, 145.8871078491211];
var CCZoom = 15;
var TASCoords = [-42.204107493733176, 147.0574951171875];
var TASZoom = 7;

var map;

//call the function initMap() in first load
initMap();

function initMap(){
    //create a map
    map = L.map('map').setView(TASCoords, TASZoom);
	
    //Add a tile layer to add to mymap - we are using Open Street Map (OSM) layer here
	var tileMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		maxZoom: 18
	});
    tileMap.addTo(map);

    //load locations from geojson - add markers to the map, and update the bottom list
    loadLocations();
}

//this function load locations from geojson - add markers to the map, and update the bottom list
function loadLocations(){
	$(document).ready(function () {
	    $.getJSON("points.geojson", function (data){
	        // 1) store all locations from geojson file into array allLocations[]
	        var allLocations =[]; //change full set array name
	        data.features.forEach(function(feature){
	            allLocations.push(feature); 
	      	});

	      	// 2) filter array by selected campus and store result into array selectedLocations[]
	        var selectedLocations = [];
	        updateSelectedLocations();//update selectedLocations array
	        
	        //3) define marker and popup information window for each location
            var markers = [];
	        for (var i=0; i < selectedLocations.length; i++) 
			{
				var id = selectedLocations[i].properties.id;
                var name = selectedLocations[i].properties.name;
                var campus = selectedLocations[i].properties.campus;
				var coords = selectedLocations[i].geometry.coordinates;
				//set content in the infoWindow 
                const content = `
                    <div class="infoWindow">
                      <p class="infoWindow_title">${name}</p>
                    </div>`;
                const markerUrl = `img/marker_${campus}.${id}.png`;
                var icon = L.icon({
                	iconUrl:markerUrl,
                	iconSize:[40,40],// size of the icon
                	iconAnchor:[20,20],// point of the icon which will correspond to marker's location
                	popupAnchor:[0,0]// point from which the popup should open relative to the iconAnchor
                });

	   			markers[i] = L.marker([coords[1],coords[0]],{icon:icon}).bindPopup(content).addTo(map);	
	   			markers[i].id=i;
	   			markers[i].on('click',function(event){
	   				showSideWindow(event.target.id);
	   			});
			}

			//4) display the selectedLocations[] at the bottom 
			updateBottomList(selectedLocations);

			// 5) when click on the image in the bottom list, display the infowindow and sidewindow
            //find your new image elements in the DOM 
			var elements = document.querySelectorAll('.list_img');
			//append the event listeners to each image
			elements.forEach(e => e.addEventListener("click", function(){
				var i = e.id;
			    showSideWindow(i);
			    markers[i].openPopup();
			}));


	        //this function update SelectedLocations array by selected campus 
	        function updateSelectedLocations(){
	        	selectedLocations = [];//empty the selectedLocation array first
                var selectedCampus = document.getElementById('campusSelector').value;
	            switch (selectedCampus){
	            case 'ALL':
	                for (var i = 0; i < allLocations.length; i++) {
	                	selectedLocations.push(allLocations[i]);
	            	}
	                break;
	            case 'SB':
	                for (var i = 0; i < allLocations.length; i++) {
	                	if (allLocations[i].properties.campus == "SB"){
	                    	selectedLocations.push(allLocations[i]);
	                	}
	            	}
	                break;
	            case 'HC':
	                for (var i = 0; i < allLocations.length; i++) {
	                	if (allLocations[i].properties.campus == "HC"){
	                    	selectedLocations.push(allLocations[i]);
	                	}
	                }
	                break;
	            case 'NH':
	                for (var i = 0; i < allLocations.length; i++) {
	                	if (allLocations[i].properties.campus == "NH"){
	                    	selectedLocations.push(allLocations[i]);
	                	}
	                }
	                break; 
	            case 'IR':
	                for (var i = 0; i < allLocations.length; i++) {
	                	if (allLocations[i].properties.campus == "IR"){
	                    	selectedLocations.push(allLocations[i]);
	                	}
	                }
	                break;  
	            case 'CC':
	                for (var i = 0; i < allLocations.length; i++) {
	                	if (allLocations[i].properties.campus == "CC"){
	                    	selectedLocations.push(allLocations[i]);
	                	}
	                }
	                break;    
	            default:
	                for (var i = 0; i < allLocations.length; i++) {
	                	selectedLocations.push(allLocations[i]);
	            	}
	            }
	        } /*function updateSelectedLocations()*/
            
            //this function updated bottom list by new selectedLocation array
            function updateBottomList(selectedLocations){
                //first, remove existing locations 
                var list = document.getElementById('scrolling_list_div');
                list.innerHTML="";

                //then, add new locations
                for (var i = 0; i < selectedLocations.length; i++) {
                    //read the features 
                    var image = selectedLocations[i].properties.image;
                    var image_alt = selectedLocations[i].properties.image_alt;
                    var name = selectedLocations[i].properties.name;
                    var id = selectedLocations[i].properties.id;
                    var campus = selectedLocations[i].properties.campus;
                    var display_name = campus.concat(".",id," ",name);
                    
                    //create image element (list_img)
                    var list_img = document.createElement("img");
                    //list_img.className = "list_img card-img-top"; 
                    list_img.className = "list_img";
                    list_img.src = image;
                    list_img.alt = image_alt;
                    list_img.id = i;

                    //create caption div element (caption_div)
                    var caption_div = document.createElement("div");
                    caption_div.className = "caption_div";
                    caption_div.innerHTML = display_name;

                    //put image and caption into a div (list_div)
                    var list_div = document.createElement("div");
                    list_div.className = "card thumbnail";
                    list_div.appendChild(list_img);
                    list_div.appendChild(caption_div);  
                                
                    //put list_div in scroller
                    scrolling_list_div.appendChild(list_div);
                }
            } /*function updateBottomList()*/
            
            //this function show the side information window
	        function showSideWindow(i){
                //read the features 
                var image = selectedLocations[i].properties.image;
                var name = selectedLocations[i].properties.name;
                var image_alt = selectedLocations[i].properties.image_alt;
                var time = selectedLocations[i].properties.time;
                var description = selectedLocations[i].properties.description;
                var point_accessibility1 = selectedLocations[i].properties.accessibility1;
                var point_accessibility2 = selectedLocations[i].properties.accessibility2;
                var point_SDG1 = selectedLocations[i].properties.SDG1;
                var point_SDG2 = selectedLocations[i].properties.SDG2;
                var ISD_icon = selectedLocations[i].properties.ISD_icon;
                
                //set the content in the side_window and display
                document.getElementById("side_window").style.display = "block";
                document.getElementById("point_image").src = image;
                document.getElementById("point_image").alt = image_alt;
                document.getElementById("point_name").innerHTML = name;

                //display time
                if(time === undefined || time === null || time == ""){
                    document.getElementById("point_time").style.display="none";
                } else {
                    document.getElementById("point_time").style.display="inline-block";
                    document.getElementById("point_time").innerHTML= time;
                } 

                //display description
                document.getElementById("point_description").innerHTML = description;

                //display ISD_icon 
                 if(ISD_icon === undefined || ISD_icon === null || ISD_icon == ""){
                    document.getElementById("ISD_icon").style.display="none";
                } else {
                    document.getElementById("ISD_icon").style.display="inline-block";
                    document.getElementById("ISD_icon").src="img/ISD_icon_"+ISD_icon+".png";
                } 

                //display accessibility*2 if exists
                if(point_accessibility1 === undefined || point_accessibility1 === null || point_accessibility1 == ""){
                    document.getElementById("point_accessibility1").style.display="none";
                } else {
                    document.getElementById("point_accessibility1").style.display="inline-block";
                    document.getElementById("point_accessibility1").src="img/"+point_accessibility1+".png";
                }              
                if(point_accessibility2 === undefined || point_accessibility2 === null || point_accessibility2 == ""){
                    document.getElementById("point_accessibility2").style.display="none";  
                } else {
                    document.getElementById("point_accessibility2").style.display="inline-block";
                    document.getElementById("point_accessibility2").src="img/"+point_accessibility2+".png";
                }
                //display SDG*2 in side window
                if(point_SDG1 === undefined || point_SDG1 === null || point_SDG1 == ""){
                    document.getElementById("point_SDG1").style.display="none";
                } else {
                    document.getElementById("point_SDG1").style.display="inline-block";
                    document.getElementById("point_SDG1").src="img/SDG_"+point_SDG1+".png";
                }
                if(point_SDG2 === undefined || point_SDG2 === null || point_SDG2 == ""){
                    document.getElementById("point_SDG2").style.display="none";  
                } else {
                    document.getElementById("point_SDG2").style.display="inline-block";
                    document.getElementById("point_SDG2").src="img/SDG_"+point_SDG2+".png";
                }       
            } /*function showSideWindow()*/
        });
    });
}

//this function refresh the map by the selected campus when user change the campus
function reloadMap(){
    //1. remove existing layer 
    map.remove();

    //2. read selected campus and initial the new map by the selected campus 
	var selectedCampus = document.getElementById('campusSelector').value;

	switch (selectedCampus){
	    case 'All Campus':
	    	map = L.map('map').setView(TASCoords, TASZoom);
	        break;
	    case 'SB':
	    	map = L.map('map').setView(SBCoords, SBZoom);
	        break;
	    case 'HC':
	    	map = L.map('map').setView(HCCoords, HCZoom);
	        break;
	    case 'NH':
	    	map = L.map('map').setView(NHCoords, NHZoom);
	        break;
	    case 'IR':
	    	map = L.map('map').setView(IRCoords, IRZoom);
	        break;
	    case 'CC':
	    	map = L.map('map').setView(CCCoords, CCZoom);
	        break;
	    default:
	    	map = L.map('map').setView(TASCoords, TASZoom);
	}
	//Add a tile layer to add to mymap - we are using Open Street Map (OSM) layer here
    var tileMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    });
    tileMap.addTo(map);
    
    //load locations from geojson - add markers to the map, and update the bottom list
    loadLocations();

    //when click on the map, close side window
    map.on('click', close_side_window);
}

//when click on the map, close side window
map.on('click', close_side_window);

//this function close the side window 
function close_side_window(){
	document.getElementById("side_window").style.display = "none";
}

	


