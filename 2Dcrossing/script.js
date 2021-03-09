const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var n,p,d
if(urlParams.has('n')){
    n = Number(urlParams.get('n'))
} else{
    n = 3
}
if(urlParams.has('d')){
    d = Number(urlParams.get('d'))
} else{
    d = 2
}
if(urlParams.has('p')){
    p = Number(urlParams.get('p'))
} else{
    p = 0.7
}
document.getElementById("n").value = n;
document.getElementById("d").value = d;
document.getElementById("p").value = p;


function set(){
    if(Number(document.getElementById("n").value) ** Number(document.getElementById("d").value) > 27){
        if(confirm("It is not advised to have n^d>27.\nContinue?")){
            n = Number(document.getElementById("n").value);
            d = Number(document.getElementById("d").value);
            p = Number(document.getElementById("p").value);
            updateCanvas()
            percolationSquares(n,p,d);
            step0();
        } else{
            document.getElementById("n").value = n;
            document.getElementById("d").value = d;
            document.getElementById("p").value = p;
        }
    } else{
        n = Number(document.getElementById("n").value);
        d = Number(document.getElementById("d").value);
        p = Number(document.getElementById("p").value);
        updateCanvas()
        percolationSquares(n,p,d);
        step0();
    }
}
function reset(){
    n = 3
    d = 2
    p = 0.7
    document.getElementById("n").value = n;
    document.getElementById("d").value = d;
    document.getElementById("p").value = p;
    updateCanvas()
    percolationSquares(n,p,d);
    step0();
}

function updateCanvas(){
    side = Math.floor( 1 + Math.min( window.innerWidth*3/4, window.innerHeight*3/4)/ (n**d) ) * (n**d)
    cell = side/n**d
    c.style.width = side
    c.style.height = side
    ctx.canvas.width  = side;
    ctx.canvas.height = side;
}

var side = Math.floor( 1 + Math.min( window.innerWidth*3/4, window.innerHeight*3/4)/ (n**d) ) * (n**d)
var cell = side/n**d

var c = document.getElementById("canvas");
c.style.width = side
c.style.height = side

var ctx = c.getContext("2d");
ctx.canvas.width  = side;
ctx.canvas.height = side;
var length = 0
var txt = document.createElement("p");
txt.innerHTML = "no right/left crossing found"; 
txt.style.width = side
txt.style.textAlign = "right"
txt.style.margin = 0
txt.style.padding = 0
txt.style.fontSize = "0.7em"

document.body.appendChild(txt);



const color0 = "#FFF";
const color3 = "#A1A1FF";//C5E3C9
const color2 = "#FAC63E";//6E82F5
const color1 = "#FF9999";//F55E5B

var squares;
percolationSquares(n,p,d)

///////////////////////////////////////////////////////

function percolation(n,p,d){
    if(d==0){
        return [[Math.random()<p]]
    } else{
        const f = Array(n).fill(false);;
        const prevperc = percolation(n,p,d-1)
        var perc = []
        for(var i=0; i<n**d; i++){
            var subperc = []
            for(var j=0; j<n**d; j++){
                if(Math.random()<p && prevperc[Math.floor(i/n)][Math.floor(j/n)]){
                    subperc.push(true)
                } else{
                    subperc.push(false)
                }
            }
            perc.push(subperc);
        }
        return perc
    }
}



function drawAll(){
    ctx.clearRect(0, 0, side, side);
    for(var i=0; i<n**d; i++){
        for(var j=0; j<n**d; j++){
            ctx.fillStyle = squares[j][i];
            ctx.fillRect(i*cell, j*cell, (i+1)*cell, (j+1)*cell);
        }
    }
}


function uniformSquares(x,y,p){
    squares = []
    for (var i = 0; i < x; i++) {
        var subsquares = []
        for (var j = 0; j < y; j++) {
            if(Math.random()<p){
                color = color3
            } else{
                color = color0
            }
            subsquares.push(color);
        } 
        squares.push(subsquares);
    }
    drawAll()
}


function percolationSquares(n,p,d){
    var perc = percolation(n,p,d);
    squares = []
    for (var i = 0; i < n**d; i++) {
        var subsquares = []
        for (var j = 0; j < n**d; j++) {
            if(perc[i][j]){
                color = color3
            } else{
                color = color0
            }
            subsquares.push(color);
        } 
        squares.push(subsquares);
    }
    drawAll()
}


///////////////////////////////////////
var active1 = []
var active2 = []

function step0(){
    active1 = []
    active2 = []
    length = 1
    txt.innerHTML = "path length: "+length
    for (var i = 0; i < n**d; i++) {
        if(squares[i][0] == color3){
            squares[i][0] = color2
            active1.push( [i,0] )
            active2.push( [i,0] )
        }
    }
    drawAll();
}

step0()

function finished(){
    for(var i = 0; i<active1.length; i++){
        if(active1[i][1] == n**d-1){
            return true
        }
    }
    return false
}

function step(){
    length += 1
    txt.innerHTML = "path length: "+length
    active2 = active1
    active1 = []
    for(var i = 0; i<active2.length; i++){
        a = active2[i]
        if(a[0]>0 && squares[a[0]-1][a[1]] == color3){
            active1.push( [a[0]-1, a[1]] )
        }
        if(a[0]<n**d-1 && squares[a[0]+1][a[1]] == color3){
            active1.push( [a[0]+1, a[1]] )
        }
        if(a[1]>0 && squares[a[0]][a[1]-1] == color3){
            active1.push( [a[0], a[1]-1] )
        }
        if(a[1]<n**d-1 && squares[a[0]][a[1]+1] == color3){
            active1.push( [a[0], a[1]+1] )
        }
    }
    for(var i = 0; i<active1.length; i++){
        a = active1[i]
        squares[a[0]][a[1]] = color2
    }
    for(var i = 0; i<active2.length; i++){
        a = active2[i]
        squares[a[0]][a[1]] = color1
    }
    drawAll()
}

var timeoutID = 0
var animate = false

function steps(click=true){
    if(click){
        animate = !animate
    }
    if(animate){
        document.getElementById("multi-step-bt").style.background = "rgb(60, 180, 180)"
        step()
        if(!(active1.length==0 && active2.length==0) && !finished()){
            timeoutStepsID = setTimeout(steps, 50, false)
        } else{
            document.getElementById("multi-step-bt").style.background = "teal"
            animate = false
            if(active1.length==0 && active2.length==0){
                txt.innerHTML = "no left/right crossing"
            } else{
                txt.innerHTML = "left/right crossing of length "+length
            }
        }
    } else{
        document.getElementById("multi-step-bt").style.background = "teal"
        clearTimeout(timeoutID);
        animate = false
    }
}


