import { Sort } from './sort.class.js';

var content;
var canvas, ctx;
var view = {w:1000,h:385};

var size = 500;
var list;
var sorted;

var delay = 0.01;

function main() {
    init_canvas();
    init_list(size);
    init_ux();
    
    sorted = new Sort(list,delay,canvas);
}

function init_list(size) {
    var build = [];
    for(var i=1;i<=size;i++) {
        build.push(i);
    }
    
    var mix = [];
    for(var j=0;j<size;j++) {
        var rand = get_rand(0,build.length);
        mix.push(build[rand]);
        build.splice(rand,1);
    }
    
    list = mix;
}

function get_rand(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function init_canvas() {
    content = document.getElementById("content");
    
    canvas = document.createElement("canvas");
    canvas.width = view.w;
    canvas.height = view.h;
    
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,view.w,view.h);
    
    content.appendChild(canvas);
}

function init_ux() {
    var form = document.createElement("form");
    var input = {};
    var original = list;
    
    var selection = document.createElement("input");
    selection.setAttribute('type','button');
    selection.setAttribute('name','selection');
    selection.setAttribute('value','selection');
    selection.addEventListener('click',function(){
        console.log('SELECTION SORT');
        sorted.selection();
    });
    form.appendChild(selection);
    
    var bubble = document.createElement("input");
    bubble.setAttribute('type','button');
    bubble.setAttribute('name','bubble');
    bubble.setAttribute('value','bubble');
    bubble.addEventListener('click',function(){
        console.log('BUBBLE SORT');
        sorted.bubble();
    });
    form.appendChild(bubble);
    
    var insertion = document.createElement("input");
    insertion.setAttribute('type','button');
    insertion.setAttribute('name','insertion');
    insertion.setAttribute('value','insertion');
    insertion.addEventListener('click',function(){
        console.log('INSERTION SORT');
        sorted.insertion();
    });
    form.appendChild(insertion);
    
    var quick = document.createElement("input");
    quick.setAttribute('type','button');
    quick.setAttribute('name','quick');
    quick.setAttribute('value','quick');
    quick.addEventListener('click',function(){
        console.log('QUICK SORT');
        sorted.quick();
    });
    form.appendChild(quick);
    
    var reset = document.createElement("input");
    reset.setAttribute('type','button');
    reset.setAttribute('name','reset');
    reset.setAttribute('value','reset');
    reset.addEventListener('click',function(){
        console.log('RESET');
        sorted.reset();
    });
    form.appendChild(reset);
    
    content.appendChild(form);
}

function reset_canvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,view.w,view.h);
}

window.onload = function() {
    main();
}