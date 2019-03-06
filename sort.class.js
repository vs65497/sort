var list;
var temp;
var size;

var timeout, secondary_timeout;
var delay; // in seconds

var i;
var sorted;
var is_sorted;
var traversals;
var exe_ping;
var in_progress;

var ctx;
var view;
var sound;

var recursion_kill;

export class Sort {
    constructor(list, delay, canvas) {
        this.list = list;
        this.temp = [].concat(this.list);
        this.size = this.list.length;
        this.delay = 1000 * delay;
        this.sorted = [];
        this.is_sorted = false;
        this.i = -1;
        this.traversals = 0;
        this.exe_ping = 0;
        this.in_progress = false;
        
        this.recursion_kill = 0;
        
        this.ctx = canvas.getContext("2d");
        this.view = {
            w: canvas.width,
            h: canvas.height
        };
        
        //this.init_sound();
        
        console.log('array ready for sorting!');
        console.log('original array:');
        console.log(this.list);
        console.log('***********\n ');
        this.draw(this.list);
    }
    
    // apparently js doesnt handle multiple sounds so well
    // all instances to this.sound commented out
    init_sound() {
        this.sound = document.createElement("audio");
        this.sound.src = 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-18146/zapsplat_cartoon_squeeze_pull_body_part_out_of_hole_pop_out_20002.mp3?_=1';
        
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    
    has_been_sorted(type) {
        if(this.is_sorted) {
            this.reset('list has already been sorted');
            
            return true;
        }
        if(this.in_progress && this.in_progress != type) {
            console.log('please wait! list is still being '+
                        this.in_progress+' sorted');
            return true;
        }
        return false;
    }
    
    selection() {
        if(this.has_been_sorted('selection')) return false;
        this.in_progress = 'selection';
        //this.sound.play();
        
        var delay = this.delay;
        var fx = (function(){
            
            var min = this.temp[0];
            var x = 0;
            
            for(var i=0;i<this.temp.length;i++) {
                this.traversals++;
                if(this.temp[i] < min) {
                    min = this.temp[i];
                    x = i;
                }
            }

            var move = this.temp[x];
            this.temp.splice(x,1);
            this.sorted.push(move);

            var display = this.sorted;
            display = display.concat(this.temp);
            this.draw(display);
            
            if(this.sorted.length == this.size) {
                clearTimeout(this.timeout);
                this.sorted = display;
                this.is_sorted = true;
                this.stats();
                
                return true; // break recursion
            }
            
            this.selection();
            
        }).bind(this);
        this.timeout = setTimeout(fx,delay);
    }
    
    bubble() {
        if(this.has_been_sorted('bubble')) return false;
        this.in_progress = 'bubble';
        //this.sound.play();
        
        var delay = this.delay;
        var fx = (function(){
            
            var has_changed = false;
            for(var i=0;i<this.temp.length-1;i++) {
                this.traversals++;
                
                if(this.temp[i] > this.temp[i+1]) {
                    var high = this.temp[i];
                    var low = this.temp[i+1];
                    
                    this.temp[i] = low;
                    this.temp[i+1] = high;
                    
                    has_changed = true;
                    
                    this.secondary_timeout = setTimeout(this.draw(this.temp),delay);
                }
            }
            
            if(!has_changed) {
                clearTimeout(this.timeout);
                clearTimeout(this.secondary_timeout);
                this.sorted = [].concat(this.temp);
                this.is_sorted = true;
                this.stats();
                
                return true; // break recursion
            }
            
            this.bubble();
            
        }).bind(this);
        this.timeout = setTimeout(fx,delay);
    }
    
    insertion() {
        if(this.has_been_sorted('insertion')) return false;
        this.in_progress = 'insertion';
        //this.sound.play();
        
        var delay = this.delay;
        var fx = (function(){
            
            var i = (this.i == -1)? 1:this.i;
            this.i = i;
            
            if(i == this.temp.length) {
                clearTimeout(this.timeout);
                this.sorted = [].concat(this.temp);
                this.is_sorted = true;
                this.i = -1;
                this.stats();

                return true; // break recursion
            }
               
            this.traversals++;
            if(this.temp[i] < this.temp[i-1]) {
                
                var move = this.temp[i];
                
                for(var j=0;j<i;j++) {
                    this.traversals++;
                    
                    if(this.temp[j] > this.temp[i]) {
                        this.temp.splice(i,1);
                        this.temp.splice(j,0,move);
                        break;
                    }
                }
            }
            
            this.draw(this.temp);
            
            this.i++;
            this.insertion();
            
        }).bind(this);
        this.timeout = setTimeout(fx,delay);
    }
    
    quick(start, end) {
        if(start == null && end == null && 
           this.has_been_sorted('quick')) return false;
        
        this.in_progress = 'quick';
        //this.sound.play();
        
        if(start == null && end == null) {
            start = 0;
            end = this.temp.length-1;
            
            var recieved = 0;
            var cycles = 0;
            var pfx = (function(){
                if(cycles < (delay*4) && this.exe_ping >= recieved) {
                    //console.log(this.exe_ping+', '+recieved);
                    recieved = this.exe_ping;
                } else {
                    clearInterval(ping);
                    //console.log('no longer recieving signal');
                    this.is_sorted = true;
                    this.sorted = [].concat(this.temp);
                    this.stats();
                }
                cycles++;
            }).bind(this);
            var ping = setInterval(pfx,delay/2);
        }
        
        this.exe_ping++;

        if(start == end) return true;

        var list = this.temp;
        var length = end+1;
        var midpoint = Math.floor((end-start)/2)+start;
        var pivot = list[midpoint];

        var i=start;
        var j=end;
        var high;
        var low;

        for(var c=0;c<length;c++) {
            this.traversals++;
            if(j>=i) {
                if(list[i] < pivot && i<length) {
                    i++;
                } else {
                    high = list[i];
                }

                if(list[j] > pivot && j>start) {
                    j--;
                } else {
                    low = list[j];
                }

                if(high != null && low != null) {
                    this.temp[i] = low;
                    this.temp[j] = high;

                    high = null;
                    low = null;

                    if(i<length) i++;
                    if(j>start) j--;

                    this.draw(list);
                }
            }
        }
        
        var delay = this.delay;
        var fx = (function(){
            
            if(j >=1) this.quick(start,j);
            if(length >1) this.quick(i,end);
            
        }).bind(this);
        this.timeout = setTimeout(fx,delay);
    }
    
    draw(display) {
        this.reset_canvas();
        
        var length = display.length;
        var width = Math.floor(this.view.w / length) - 1;
        var gap = (this.view.w - ((width + 1) * length));
        
        this.ctx.fillStyle = 'white';
        this.ctx.translate(gap,0);
        for(var i=0;i<length;i++) {
            var height = Math.floor((display[i]/length) * this.view.h) -1;
            var x = (width + 1) * i;
            
            this.ctx.fillRect(x,0,width,height);
            
            //this.sound.currentTime = 0;
        }
        this.ctx.translate(-gap,0);
    }
    
    stats() {
        //var completed_in = (this.delay / 1000) * this.executions;
        //completed_in = completed_in.toFixed(2);
        var completed_in = '--:--';
        var time = this.traversals;
        var bigo;
        
        if(time >= Math.pow(this.size,2)) {
            bigo = 'N^2';
        } else if(time >= this.size) {
            bigo = 'N';
        } else {
            bigo = '1';
        }
        
        console.log('sort complete!');
        //console.log('completed in '+completed_in+' seconds - Big O('+bigo+') time');
        console.log('traversals: '+this.traversals);
        console.log(this.sorted);
        console.log('***********\n ');
        
        this.in_progress = false;
        this.traversals = 0;
        //this.sound.stop();
    }
    
    reset(error) {
        error = (error == null)? '':'ERROR: '+String(error);
        error += '\n ';
        if(this.timeout != null) clearTimeout(this.timeout);
        this.traversals = 0;
        this.sorted = [];
        this.is_sorted = false;
        this.i = -1;
        this.in_progress = false;
        this.temp = [].concat(this.list);
        //this.sound.stop();
        
        console.log(error+'array reset to original!');
        console.log(this.list);
        console.log();
        this.draw(this.list);
    }
    
    get_list() {
        return this.list;
    }
    
    get_sorted() {
        return this.sorted;
    }
    
    reset_canvas() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.view.w,this.view.h);
    }
}