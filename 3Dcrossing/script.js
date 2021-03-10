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
    if(Number(document.getElementById("n").value) ** Number(document.getElementById("d").value) > 16){
        if(confirm("It is not advised to have n^d>16.\nContinue?")){
            n = Number(document.getElementById("n").value);
            d = Number(document.getElementById("d").value);
            p = Number(document.getElementById("p").value);
            materials = percolationCubes(n,p,d);
        } else{
            document.getElementById("n").value = n;
            document.getElementById("d").value = d;
            document.getElementById("p").value = p;
        }
    } else{
        n = Number(document.getElementById("n").value);
        d = Number(document.getElementById("d").value);
        p = Number(document.getElementById("p").value);
        materials = percolationCubes(n,p,d);
    }
}
function reset(){
    n = 3
    d = 2
    p = 0.7
    document.getElementById("n").value = n;
    document.getElementById("d").value = d;
    document.getElementById("p").value = p;
    materials = percolationCubes(n,p,d);
}





var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
//var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth*3/4, window.innerHeight*3/4);
document.body.appendChild(renderer.domElement);
var length = 0
var txt = document.createElement("p");
txt.innerHTML = "no right/left crossing found"; 
txt.style.width = window.innerWidth*3/4;
txt.style.textAlign = "right"
txt.style.margin = 0
txt.style.padding = 0
txt.style.fontSize = "0.7em"

document.body.appendChild(txt);



const color0 = new THREE.Color(   0,   0,   0 );
const color1 = new THREE.Color(   1, 0.5, 0.5 );
const color2 = new THREE.Color(   1, 0.8,   0 );
const color3 = new THREE.Color( 0.5, 0.5,   1 );



// var materials = uniformCubes(n**d, n**d, n**d)
var materials = percolationCubes(n,p,d)




///////////////////////////////////////////////////////

function percolation(n,p,d){
    if(d==0){
        return [[[Math.random()<p]]]
    }else{
        const f = Array(n).fill(false);;
        const prevperc = percolation(n,p,d-1)
        var perc = []
        for(var i=0; i<n**d; i++){
            var subperc = []
            for(var j=0; j<n**d; j++){
                var subsubperc = []
                for(var k=0; k<n**d; k++){
                    if(Math.random()<p && prevperc[Math.floor(i/n)][Math.floor(j/n)][Math.floor(k/n)]){
                        subsubperc.push(true)
                    }else{
                        subsubperc.push(false)
                    }
                }
                subperc.push(subsubperc);
            }
            perc.push(subperc);
        }
        return perc
    }
}




function draw_line(x1,y1,z1, x2,y2,z2){
    var points = [];
    points.push( new THREE.Vector3( x1,y1,z1 ) );
    points.push( new THREE.Vector3( x2,y2,z2 ) );
    points.push( new THREE.Vector3( x1,y1,z1 ) );
    var g = new THREE.BufferGeometry().setFromPoints( points );
    var l = new THREE.Line( g, lines_material)
    scene.add( l );
}

function removeAll(){
    for( var i = scene.children.length - 1; i >= 0; i--) { 
        obj = scene.children[i];
        scene.remove(obj); 
    }
}

function uniformCubes(x,y,z,p){
    removeAll()
    var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: false});
    material.needsUpdate = true
    material.transparent = true
    material.opacity = 0.2
    material.depthWrite = false

    var materials = []
    for (var i = 0; i < x; i++) {
        var submaterials = []
        for (var j = 0; j < y; j++) {
            var subsubmaterials = []
            for (var k = 0; k < z; k++) {
                geom = new THREE.BoxGeometry(1,1,1);
                geom.translate(i-(x/2),j-(y/2),k-(z/2));
                mat = material.clone();
                if(Math.random()<p){
                    mat.color = color3
                    mat.opacity = 0.2
                } else{
                    mat.color = color0
                    mat.opacity = 0
                }
                
                scene.add(new THREE.Mesh(geom, mat));
                subsubmaterials.push(mat);
            } 
            submaterials.push(subsubmaterials);
        } 
        materials.push(submaterials);
    }
    active1 = []
    active2 = []
    return materials
}


function percolationCubes(n,p,d){
    removeAll()
    var perc = percolation(n,p,d);
    var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: false});
    material.needsUpdate = true
    material.transparent = true
    material.opacity = 0.2
    material.depthWrite = false

    var materials = []
    for (var i = 0; i < n**d; i++) {
        var submaterials = []
        for (var j = 0; j < n**d; j++) {
            var subsubmaterials = []
            for (var k = 0; k < n**d; k++) {
                geom = new THREE.BoxGeometry(1,1,1);
                geom.translate(i-(n**d/2),j-(n**d/2),k-(n**d/2));
                mat = material.clone();
                if(perc[i][j][k]){
                    mat.color = color3
                    mat.opacity = 0.2
                } else{
                    mat.color = color0
                    mat.opacity = 0
                }
                
                scene.add(new THREE.Mesh(geom, mat));
                subsubmaterials.push(mat);
            } 
            submaterials.push(subsubmaterials);
        } 
        materials.push(submaterials);
    }
    active1 = []
    active2 = []
    return materials
}


///////////////////////////////////////
var active1 = []
var active2 = []

function step0(){
    if(active1.length==0 && active2.length==0){
        active1 = []
        active2 = []
        length = 1
        txt.innerHTML = "path length: "+length
        for (var i = 0; i < n**d; i++) {
            for (var j = 0; j < n**d; j++) {
                if(materials[i][j][0].color == color3 || materials[i][j][0].color == color2){
                    materials[i][j][0].color = color2
                    materials[i][j][0].opacity = 0.3
                    active1.push( [i,j,0] )
                    active2.push( [i,j,0] )
                }
            }
        }
    }
}


function finished(){
    for(var i = 0; i<active1.length; i++){
        if(active1[i][2] == n**d-1){
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
        if(a[0]>0 && materials[a[0]-1][a[1]][a[2]].color == color3){
            active1.push( [a[0]-1, a[1], a[2]] )
        }
        if(a[0]<n**d-1 && materials[a[0]+1][a[1]][a[2]].color == color3){
            active1.push( [a[0]+1, a[1], a[2]] )
        }
        if(a[1]>0 && materials[a[0]][a[1]-1][a[2]].color == color3){
            active1.push( [a[0], a[1]-1, a[2]] )
        }
        if(a[1]<n**d-1 && materials[a[0]][a[1]+1][a[2]].color == color3){
            active1.push( [a[0], a[1]+1, a[2]] )
        }
        if(a[2]>0 && materials[a[0]][a[1]][a[2]-1].color == color3){
            active1.push( [a[0], a[1], a[2]-1] )
        }
        if(a[2]<n**d-1 && materials[a[0]][a[1]][a[2]+1].color == color3){
            active1.push( [a[0], a[1], a[2]+1] )
        }

    }
    for(var i = 0; i<active2.length; i++){
        a = active2[i]
        materials[a[0]][a[1]][a[2]].color = color1
        materials[a[0]][a[1]][a[2]].opacity = 0.1
    }
    for(var i = 0; i<active1.length; i++){
        a = active1[i]
        materials[a[0]][a[1]][a[2]].color = color2
        materials[a[0]][a[1]][a[2]].opacity = 0.3
    }

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

var rotate = false
document.getElementById('rotate-bt').onclick = function(){
    rotate = !rotate
    if(rotate){
        document.getElementById("rotate-bt").style.background = "lightgreen"
    } else{
        document.getElementById("rotate-bt").style.background = "green"
    }
}

function render() {
    setTimeout(placeCamera, 5);
    requestAnimationFrame(render);
    if(rotate){
        rho += 0.01
        camera.rotateY(-0.01)
        //camera.rotateZ(0.01);
    }
};
render();




////////////////////////////////////////////

var theta = Math.PI
var rho = 0
var r = Math.sqrt(3)*(n**d)

function placeCamera(){
    if(r<n**d){
        r = n**d
    }
    xy = r * Math.cos(rho)
    camera.position.x = xy * Math.cos(theta)
    camera.position.y = xy * Math.sin(theta)
    camera.position.z = r * Math.sin(rho)
    camera.lookAt(0,0,0)
    renderer.render(scene, camera);
}
placeCamera();


document.onkeydown = function(e){
    if(e.keyCode === 39){
        //right
        rho += 0.05
        camera.rotateY(-0.05)
    }
    if(e.keyCode === 37){
        //left
        rho -= 0.05
        camera.rotateY(0.05)
    }
    if(e.keyCode === 40){
        //up
        r += 0.25
    }
    if(e.keyCode === 38){
        //down
        r -= 0.25
    }
    // if(e.keyCode === 39){
    //     //right
    //     theta += 0.05
    //     camera.rotateX(-0.05)
    // }
    // if(e.keyCode === 37){
    //     //left
    //     theta -= 0.05
    //     camera.rotateX(0.05)
    // }
    placeCamera()
}

