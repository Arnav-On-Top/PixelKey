var area=document.getElementById("drawingArea");
var colorBox=document.getElementById("currentColor");
var boxes=[];
var position=0;
var color="black";
var mode="draw";
var grid=20;
var undoList=[];
var redoList=[];
var coordinatesText=document.getElementById("coordinates");
var gridText=document.getElementById("gridSize");
var modeText=document.getElementById("mode");
function createGrid() {
    area.innerHTML="";
    boxes=[];
    position=0;
    area.style.gridTemplateColumns="repeat("+grid+", 1fr)";
    for (var i=0; i<grid*grid; i++) {
        var box=document.createElement("div");
        box.className="box";
        area.appendChild(box);
        boxes.push(box);
    }
    boxes[position].classList.add("cursor");
    gridText.innerHTML="Grid: "+grid+" x "+grid;
    updateCoordinates();
}
createGrid();
function updateCoordinates() {
    var x=position%grid;
    var y=Math.floor(position/grid);
    coordinatesText.innerHTML="X: "+(x+1)+" | Y: "+(y+1);
}
updateCoordinates();
function mirrorSquare() {
    var x=position%grid;
    var y=Math.floor(position/grid);
    var mirrorX=grid-1-x;
    var mirrorPosition=y*grid+mirrorX;
    if(mode=="erase") {
        boxes[mirrorPosition].style.backgroundColor="white";
    }
    else {
        boxes[mirrorPosition].style.backgroundColor=color;
    }
}
function SaveForUndo() {
    var drawing=[];
    for(var i=0; i<boxes.length; i++) {
        drawing.push(boxes[i].style.backgroundColor);
    }
    undoList.push(drawing);
    redoList=[];
}
function getDrawing() {
    var drawing=[];
    for(var i=0; i<boxes.length; i++) {
        drawing.push(boxes[i].style.backgroundColor);
    }
    return drawing;
}
function putDrawing(drawing) {
    for(var i=0; i<boxes.length; i++) {
        boxes[i].style.backgroundColor=drawing[i];
    }
}
document.addEventListener("keydown", function(event) {
    if (event.key=="Tab") {
        event.preventDefault();
        return;
    }
    if (event.key=="ArrowUp" || event.key=="ArrowDown" ||  event.key=="ArrowLeft" || event.key=="ArrowRight" || event.key=="Tab") {
        event.preventDefault();
    }
    var oldPosition=position;
    if (event.key=="ArrowUp") {
        if(position>=grid) {
            position=position-grid;
        }
    }
    if (event.key=="ArrowDown") {
        if (position<grid*grid-grid) {
            position=position+grid;
        }
    }
    if (event.key=="ArrowLeft") {
        if (position%grid!=0) {
            position=position-1;
        }
    }
    if (event.key=="ArrowRight") {
        if (position%grid!=grid-1) {
            position=position+1;
        }
    }
    boxes[oldPosition].classList.remove("cursor");
    if (event.shiftKey) {
        SaveForUndo();
        if (mode=="erase") {
            boxes[position].style.backgroundColor="white";
        }
        else {
            boxes[position].style.backgroundColor=color;
        }
        if(mode=="mirror") {
            mirrorSquare();
        }
    }
    boxes[position].classList.add("cursor");
    updateCoordinates();
    if (event.key=="1") {
        color="red";
        colorBox.style.backgroundColor="red";
    }
    if (event.key=="2") {
        color="blue";
        colorBox.style.backgroundColor="blue";
    }
    if (event.key=="3") {
        color="green";
        colorBox.style.backgroundColor="green";
    }
    if (event.key=="4") {
        color="yellow";
        colorBox.style.backgroundColor="yellow";
    }
    if (event.key=="5") {
        color="purple";
        colorBox.style.backgroundColor="purple";
    }
    if (event.key=="6") {
        color="orange";
        colorBox.style.backgroundColor="orange";
    }
    if (event.key=="7") {
        color="black";
        colorBox.style.backgroundColor="black";
    }
    if (event.key=="e" || event.key=="E") {
        if (mode=="erase") {
            mode="draw";
            modeText.innerHTML="Mode: Draw";
        }
        else {
            mode="erase";
            modeText.innerHTML="Mode: Eraser"
        }
    }
    if (event.key=="m" || event.key=="M") {
        if(mode=="mirror") {
            mode="draw";modeText.innerHTML="Mode: Draw";
        }
        else {
            mode="mirror";
            modeText.innerHTML="Mode: Mirror"
        }
    }
    if (event.key=="c" || event.key=="C") {
        SaveForUndo();
        for(var i=0; i<boxes.length; i++) {
            boxes[i].style.backgroundColor="white";
        }
    }
    if (event.key=="z" || event.key=="Z") {
        if (undoList.length>0) {
            var currentDrawing=getDrawing();
            redoList.push(currentDrawing);
            var oldDrawing=undoList.pop();
            putDrawing(oldDrawing);
        }
    }
    if (event.key=="y" || event.key=="Y") {
        if (redoList.length>0) {
            var currentDrawing=getDrawing();
            undoList.push(currentDrawing);
            var newDrawing=redoList.pop();
            putDrawing(newDrawing);
        }
    }
    if (event.key=="+") {
        if (grid<30) {
            grid=grid+5;
            createGrid();
        }
    }
    if (event.key=="-") {
        if (grid>10) {
            grid=grid-5;
            createGrid();
        }
    }
    if(event.key=="s" || event.key=="S") {
        saveImage("png");
    }
    if (event.key=="j" || event.key=="J") {
        saveImage("jpg");
    }
});
function saveImage(type) {
    var canvas=document.createElement("canvas");
    var size=500;
    var cellSize=size/grid;
    var context=canvas.getContext("2d");
    canvas.width=size;
    canvas.height=size;
    for (var i=0; i<boxes.length; i++) {
        var x=i%grid;
        var y=Math.floor(i/grid);
        var boxColor=boxes[i].style.backgroundColor;
        if(boxColor=="") {
            boxColor="white";
        }
        context.fillStyle=boxColor;
        context.fillRect(x*cellSize,
            y*cellSize,
            cellSize,
            cellSize
        );
    }
    if(type=="png") {
        var image=canvas.toDataURL("image/png");
        var link=document.createElement("a");
        link.href=image;
        link.download="PixelKey.png"
        link.click();
    }
    if(type=="jpg") {
        var image=canvas.toDataURL("image/jpeg");
        var link=document.createElement("a");
        link.href=image;
        link.download="PixelKey.jpg";
        link.click();
    }
}