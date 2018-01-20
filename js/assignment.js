"use strict";

// alert('this is assignment');
var currentVal = 0;
var number_bars = 0; 
var bar_Limit = 0; 
var number_btn = 0;

// create function to call endpoints
function get_Endpoint(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

      	var progressBars = JSON.parse(this.responseText);

      	//console.log('json',progressBars);
      	number_bars = progressBars.bars.length;
      	bar_Limit = progressBars.limit; 
      	number_btn = progressBars.buttons.length;

   		var select_html = '';
   		var bar_html = '';
   		var btn_html = '';

      		select_html = '<select onchange="number_value(this.value)" class="dropdown-selected">';

		for(var i = 0; i < number_bars; i++) {
		    var x = i + 1;
		    bar_html += '<div class="progress_width" id="progress_width'+i+'"><div class="bar_with" id="bar_'+i+'"><div class="label" id="label_'+i+'">0%</div></div></div>';  
		    select_html += '<option value="'+i+'">Progress Bar #'+x+'</option>';
		}

		select_html += '</select>';

		document.getElementById('progress').innerHTML = bar_html;


		for(var i = 0; i < number_btn; i++) {
		    var val = progressBars.buttons[i];
		    btn_html += '<input type="button" class="btn btn-primary buttonBox" value="'+val+'" onclick="control(this)">'; 
		  }

		 document.getElementById('progress-div').innerHTML = select_html + btn_html;

		  for(var i = 0; i < number_bars; i++) {
		    currentVal = i;
		    var val = progressBars.bars[i];
		    animate_width(cal_percent(val, bar_Limit)); 
		  }

		  number_value(0);


		    }
  };
  xhttp.open("GET", "http://pb-api.herokuapp.com/bars", true);
  xhttp.send();
}

get_Endpoint();

function control(obj){  
  animate_width(parseInt(obj.value));
}

function cal_percent(val, limit){
  if(limit > 0) {
    return Math.round((parseFloat(val) / parseFloat(limit)) * 100);
  }
  return 0;
}

function number_value(val){
  currentVal = val;

  for(var i = 0; i < number_bars; i++) {
    document.getElementById('progress_width' + i).classList.remove("selected");
  }
  	document.getElementById('progress_width' + currentVal).classList.add("selected");
}

function animate_width(value) {
	
  var bar_id = document.getElementById('bar_' + currentVal);
  var max, type = 'type_add'; 
  var label_id = document.getElementById('label_' + currentVal);  
  var percentNum = parseInt(label_id.innerHTML);  
  var timer = setInterval(interval, 12);
  
  if(isNaN(percentNum)){
    percentNum = 0;
  }
  max = percentNum + value;  
  
  if(max < percentNum){
  	type = 'type_sub';  
  }
    

  function interval() {

      if(type == 'type_add'){
      
        percentNum++;

      }else{

        percentNum--;
      
      }

      if(percentNum == max || max == 0){
      	clearInterval(timer);
      }
        
      if (percentNum >= 0 && percentNum <= 100) {        
        label_id.innerHTML = percentNum + '%';

        //console.log('cal', percentNum);
        bar_id.style.width = percentNum + '%';  
        bar_id.style.backgroundColor = '#70b8e4';  
      }
      else if (percentNum > 100) {      
        label_id.innerHTML = percentNum + '%';
        bar_id.style.backgroundColor = 'red';        
      }                 
  }

}