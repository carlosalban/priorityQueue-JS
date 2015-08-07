
var priorityQueue = [];
var heapSize = 0;
var count = 0;
var maxCycles = 30; //change this for testing higher than 30 cycles
var empty = false;
var startTime;
var outputData = [];
var dataString;



$( document ).ready(function() {

	$('#reset').click(function() {
			location.reload();
	});

	$(function(){
		$('#go').click(function() {

	
	startTime = moment();
	dataString = document.getElementById('textDIV').innerText;
	//console.log(dataString);
	
	if (dataString == ""){
		empty = true;
		alert("Selected .txt file is not in correct format. Please check erroneous characters.");
	}
	else {

		//Read from file
		var singleCycleData = [];
		singleCycleData[0] = [];
		singleCycleData = getCycle2DArray(dataString);
		
		console.log("singleCycleData.length is " + singleCycleData.length);
	
		for (i = 0; (i < (singleCycleData.length)) && (empty == false) && (i < maxCycles); i++){
		console.log("i is " + i);
			count++;
			
			if (i == 0){
				BuildQueue(singleCycleData[0]); //Initial Array
				//Heapify(priorityQueue,1)
				outputData.push(count +": enqueued " + singleCycleData[0].length +" nodes.<br>");
					
			}
			else{				
				if (!singleCycleData[i]) {
    					singleCycleData[i] = [];
				}
				console.log(singleCycleData[i]);
				for (j = 0; j < singleCycleData[i].length; j++){
					
					Insert(singleCycleData[i][j]);
					outputData.push(count + ": enqueued ("+singleCycleData[i][j].rule+","+singleCycleData[i][j].priority+")<br>");
					for (k = Math.floor(priorityQueue.length/2); k > 0; k--){
						Heapify(priorityQueue,k);
					}
				}

			}
			console.log("---- Cycle finished. ----");
			
			outputData.push(count +": <strong>dequeued" + ExtractMax()+"</strong><br><br>");

			
		} //close for
		
		while ((empty == false) && (count < maxCycles)){
			count++;
			console.log("---- Cycle finished. ----");
			outputData.push(count +": <strong>dequeued" + ExtractMax()+"</strong><br><br>");
			heapSize--;
			empty = Empty();
		} //close while
		
		
	} //close else
	
	outputHTML();
	
	  });
	});

});


function Heapify (queue, index){
		
		var left = index*2;
		var right = index*2+1;
		var largest;
		//console.log("left is " + left);
		//console.log("right is " + right);
		//console.log("index is " + index);
		//console.log("Heap size is " + heapSize);
		
		if ((left <= heapSize) && queue[left].priority > queue[index].priority){
			largest = left;
			//console.log("case 1st if: largest is " + largest + " with priority of " + queue[largest].priority);
		}
		else {
			largest = index;
			//console.log("case else: largest is " + largest + " with priority of " + queue[largest].priority);
		}
		if ((right <= heapSize) && queue[right].priority > queue[largest].priority){
			largest = right;
			//console.log("case 2nd if: largest is " + largest + " with priority of " + queue[largest].priority);
		}
		if (largest != index){
			//Swap
			console.log("Swap " + queue[index].priority + " and " + queue[largest].priority);
			var temp = queue[index];
			queue[index] = queue[largest];
			queue[largest] = temp; 
			Heapify(queue, largest);
		}

}

function BuildQueue(data){

	var blankNode = {
		rule: "Not Used",
		priority: parseInt(-1)
	};

	priorityQueue.push(blankNode); //first element of PQ is blank. Starting point
	
	for (z = 0; z < data.length; z++){
		Insert(data[z]);
	}
	for (k = Math.floor(priorityQueue.length/2); k > 0; k--){
		Heapify(priorityQueue,k);
	}
	console.dir(priorityQueue);

	
}

//BASIC

function Empty (){

	if (heapSize == 0){
		console.log("Warning! Queue is empty.");
		return true;
	}
	else {
		return false;
	}
}


function Insert(node){

	priorityQueue.push(node); //add node to the end of the array (equal to new rightmost leaf in the tree OR adding a new leaf if tree is complete)
	heapSize++;
	console.log("Inserted and heapify ran for ("+node.rule+","+node.priority+") " + "with heapSize of " + heapSize);
	//Heapify(priorityQueue, heapSize);

}

function ExtractMax(){

	var max = priorityQueue[1];
	priorityQueue[1] = priorityQueue.pop(); //pop removes last element of array and returns that element
	heapSize--;
	for (k = Math.floor(priorityQueue.length/2); k > 1; k--){
		Heapify(priorityQueue,k);
	}
	//console.log("Max is " + max);
	//return "(" + max.rule + "," + max.priority + ") dequeued.";
	return "("+max.rule+","+max.priority+")";

}

//OUTPUT

function outputHTML(){
	//var endTime = new Date().getTime();
	var endTime = moment();
	var elapsedT = endTime - startTime
	console.log("Elapsed time is " + elapsedT);
	$("#output1").append("<p><strong>Cycle Output from Agenda Manager: </strong><br></p>");
	for(i = 0; i < outputData.length; i++){
		$("#output1").append(JSON.stringify(outputData[i]));
		}
	$("#output2").append("<p><strong>Heap array at termination is: </strong></p><pre>" + JSON.stringify(priorityQueue, null,1) +"</pre>");
	$("#output3").append("<p><strong>Number of cycles is </strong>" + count + "</p><p><strong>Time from start to finish is </strong>" + elapsedT + " ms for " +  (heapSize + count) + " inputs" +"</p>");
	document.getElementById('textDIV').innerText;	
	//console.log(priorityQueue);
	console.log("Heap size is " + heapSize);
	console.log("Number of cycles is " + count);
	//ExtractMax();
	//console.log("End time is " + Date());
}

//USED FOR PREPROCESSING

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
                return allText;
            }
        }
    }
    rawFile.send(null);
}

function getCycle2DArray(data, line){

	var linesplit = data.split("\n", maxCycles); //Gets each line. Parameters: (seperator,limit)
	//console.log("linesplit is " + linesplit[0]);
	//console.log("length of linesplit is " + linesplit.length);
	var i, j;
	var cycle2DArray = [];
	cycle2DArray[0] = [];
	cycle2DArray[i] = [];

	for (i=0; i < linesplit.length; i++){
		var regExp = /\(([^)]+)\)/g; //Get data between "(" and ")"
		var matches,
			results = [];
		while (matches = regExp.exec(linesplit[i])){
			results.push(matches[1]);//Store each node as element in array
		} 
		//console.log("results is " + results);
		//console.log("length of results is " + results.length);
		for (j = 0; j < results.length; j++){
			var nodesplit = results[j].split(", ");
			nodesplit[0].replace(/\(|\)/g,'')
			//console.log("nodesplit is " + nodesplit[1]);
			var node = {
				rule: nodesplit[0],
				priority: parseInt(nodesplit[1])
			};
			//console.log("node.rule is " + node.rule);
			//console.log("node.priority is " + node.priority);
			//console.log("i is " + i + " and j is " + j);
			if (!cycle2DArray[i]) {
    			cycle2DArray[i] = [];
			}
			cycle2DArray[i][j] = node;
		}

	}
	//console.log(cycle2DArray);
	return cycle2DArray;
}
