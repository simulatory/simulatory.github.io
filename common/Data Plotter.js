console.log("'Data Plotter.js' loaded.");
function DataPlot(fieldCanvas, graphName, seriesList, seriesNames, seriesColors, xAxisName, yAxisName, connectPoints){
	this.graphCanvas = fieldCanvas;
	this.ctx = fieldCanvas.getContext("2d");
	this.graphName = graphName;
	this.seriesList = seriesList;
	this.seriesNames = seriesNames;
	this.seriesColors = seriesColors;
	this.xAxisName = xAxisName;
	this.yAxisName = yAxisName;
	this.connectPoints = connectPoints;
	this.horizontalGridDensity = 12;
	this.verticalGridDensity = 8;
	this.update = function(){
		ctxWidth = this.graphCanvas.width;
		ctxHeight = this.graphCanvas.height;
		this.ctx.clearRect(0,0,ctxWidth,ctxHeight)
		//find min and max
		minDataX = seriesList[0][0]; // \
		minDataY = seriesList[0][1]; //  \__setting initial min/max to first x and y of first series
		maxDataX = seriesList[0][0]; //  /
		maxDataY = seriesList[0][1]; // /
		for(j = 0; j < seriesList.length; j++){ //looping through list of series
			for(i = 0; i < seriesList[j].length - 1; i += 2){ //looping through coordinates of series
				if(seriesList[j][i] < minDataX) minDataX = seriesList[j][i];
				if(seriesList[j][i] > maxDataX) maxDataX = seriesList[j][i];
				if(seriesList[j][i+1] < minDataY) minDataY = seriesList[j][i+1];
				if(seriesList[j][i+1] > maxDataY) maxDataY = seriesList[j][i+1];
			}
		}
		dataRangeX = maxDataX - minDataX;
		dataRangeY = maxDataY - minDataY;
		maxDataX += getNextMult(this.horizontalGridDensity + 1, dataRangeX * 0.05);
		minDataX -= getPrevMult(this.horizontalGridDensity + 1, dataRangeX * 0.05);
		maxDataY += getNextMult(this.verticalGridDensity + 1, dataRangeY * 0.05);
		minDataY -= getPrevMult(this.verticalGridDensity + 1, dataRangeY * 0.05);
		dataRangeX = maxDataX - minDataX;
		dataRangeY = maxDataY - minDataY;
		console.log("MinX: " + minDataX + " MaxX: " + maxDataX + " Range: " + dataRangeX);
		console.log("MinY: " + minDataY + " MaxY: " + maxDataY + " Range: " + dataRangeY);
		this.ctx.font = "30px Arial";
		this.ctx.textAlign = "left";
		this.ctx.fillStyle = "#a4a4a4";
		this.ctx.fillText(graphName,ctxWidth *0.1,ctxHeight * 0.1);
		this.ctx.font = "10px Arial";
		this.ctx.beginPath();
		this.ctx.strokeStyle="#a4a4a4";
		this.ctx.textAlign = "center";
		//vertical grid lines
		for(i=1; i<this.horizontalGridDensity; i++){
			this.ctx.moveTo(ctxWidth * 0.15 + (ctxWidth * (0.8 / this.horizontalGridDensity) * i),ctxHeight * 0.2);
			this.ctx.lineTo(ctxWidth * 0.15 + (ctxWidth * (0.8 / this.horizontalGridDensity) * i),ctxHeight * 0.8);
			this.ctx.fillText(((minDataX + i * (dataRangeX/this.horizontalGridDensity)).toString()).substring(0,8), ctxWidth * 0.15 + (ctxWidth * (0.8 / this.horizontalGridDensity) * i),ctxHeight * 0.82);
		}
		this.ctx.fillText(minDataX, ctxWidth * 0.15,ctxHeight * 0.82);
		//horizontal grid lines
		this.ctx.textAlign = "right";
		for(i=1; i<this.verticalGridDensity; i++){
			this.ctx.moveTo(ctxWidth * 0.15, ctxHeight * 0.2 + (ctxHeight * (0.6 / this.verticalGridDensity) * i));
			this.ctx.lineTo(ctxWidth * 0.95, ctxHeight * 0.2 + (ctxHeight * (0.6 / this.verticalGridDensity) * i));
			this.ctx.fillText(((minDataY + i * (dataRangeY/this.verticalGridDensity)).toString()).substring(0,8), ctxWidth * 0.145, ctxHeight * 0.805 - (ctxHeight * (0.6 / this.verticalGridDensity) * i));
		}
		this.ctx.fillText(minDataY, ctxWidth * 0.14,ctxHeight * 0.805);
		this.ctx.stroke();
		this.ctx.closePath();
			
		this.ctx.beginPath();
		this.ctx.strokeStyle="black";
		this.ctx.rect(ctxWidth * 0.15, ctxHeight * 0.2, (ctxWidth * 0.8), ctxHeight * 0.6);
		this.ctx.stroke();
		this.ctx.closePath();
		
		for(j = 0; j < seriesList.length; j++){
			this.ctx.fillStyle = seriesColors[j];
			this.ctx.strokeStyle = seriesColors[j];
			for(i = 0; i < seriesList[j].length - 1; i+=2){
				//plotting points from series
				this.ctx.beginPath();
				this.ctx.arc(ctxWidth * 0.15 + ctxWidth * 0.8 * ((seriesList[j][i] - minDataX)/ dataRangeX), ctxHeight * 0.8 - ctxHeight * 0.6 * ((seriesList[j][i + 1]  - minDataY)/ dataRangeY), 2, 0, Math.PI * 2, true);
				this.ctx.fill();
				this.ctx.closePath();
			}
			//drawing line
			if(connectPoints){
				this.ctx.beginPath();
				this.ctx.moveTo(ctxWidth * 0.15 + ctxWidth * 0.8 * ((seriesList[j][0] - minDataX)/ dataRangeX), ctxHeight * 0.8 - ctxHeight * 0.6 * ((seriesList[j][1]  - minDataY)/ dataRangeY));
				for(i = 2; i < seriesList[j].length - 1; i+=2){
					this.ctx.lineTo(ctxWidth * 0.15 + ctxWidth * 0.8 * ((seriesList[j][i] - minDataX)/ dataRangeX), ctxHeight * 0.8 - ctxHeight * 0.6 * ((seriesList[j][i + 1]  - minDataY)/ dataRangeY));
				}
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}

	}
	this.addSeries = function(seriesName, newSeries, seriesColor){
		seriesNames.push(seriesName);
		seriesList.push(newSeries);
		seriesColors.push(seriesColor);
	}
	
	window.addEventListener("keydown", function(keyDown){
		if(keyDown.keyCode == 37){
			fieldCanvas.width -= 5;
			this.update();
		}
		if(keyDown.keyCode == 38){
			fieldCanvas.height += 5;
			this.update();
		}
		if(keyDown.keyCode == 39){
			fieldCanvas.width += 5;
			this.update();
		}
		if(keyDown.keyCode == 40){
			fieldCanvas.height -= 5;
			this.update();
		}
	});
}


window.addEventListener("keydown", function(e) {
	// space and arrow keys
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);

//generates random int between [min, max) inclusive/exclusive, respectively
function randInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getNextMult(factor, curr){
	return Math.ceil(curr / factor) * factor;
}
function getPrevMult(factor, curr){
	return Math.floor(curr / factor) * factor;
}