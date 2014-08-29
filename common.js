(function() {
	var lastTime = 0;
	var vendors = ['ms', ';', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = 
		  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var loader = {
    loaded:true,
    loadedCount:0, 
    totalCount:0, 
    
    init:function(){
        var mp3Support,oggSupport;
        var audio = document.createElement('audio');
    	if (audio.canPlayType) {
      		mp3Support = "" != audio.canPlayType('audio/mpeg');
      		oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
    	} else {
    		mp3Support = false;
    		oggSupport = false;	
    	}
        loader.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
        
    },
    loadImage:function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    soundFileExtn:".ogg",
    loadSound:function(){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var audio = new Audio();
        audio.src = url+loader.soundFileExtn;
        image.onload = loader.itemLoaded;
        return image;   
    },
    itemLoaded:function(){
        loader.loadedCount++;
        $('#loadingmessage').html('Loaded '+loader.loadedCount+' of '+loader.totalCount);
        if (loader.loadedCount === loader.totalCount){
            loader.loaded = true;
            //alert('hiding');
            $('#loadingscreen').hide();
            if(loader.onload){
                loader.onload();
                loader.onload = undefined;
            }
           
        }
    }
}
function loadItem(name){
	var item = this.list[name];
	if(item.spriteArray){
		return;
	}		
	item.spriteSheet = loader.loadImage('images/'+this.defaults.type+'/'+name+'.png');
	item.spriteArray = [];
	item.spriteCount = 0;
	
    for (var i=0; i < item.spriteImages.length; i++){             
        var constructImageCount = item.spriteImages[i].count; 
		var constructDirectionCount = item.spriteImages[i].directions; 
		if (constructDirectionCount){
			for (var j=0; j < constructDirectionCount; j++) {
				var constructImageName = item.spriteImages[i].name +"-"+j;
				item.spriteArray[constructImageName] = {
					name:constructImageName,
					count:constructImageCount,
					offset:item.spriteCount
				};
				item.spriteCount += constructImageCount;
			};
		} else {
			var constructImageName = item.spriteImages[i].name;
            item.spriteArray[constructImageName] = {
				name:constructImageName,
				count:constructImageCount,
				offset:item.spriteCount
			};
    	    item.spriteCount += constructImageCount;
		}
    }
	if(item.weaponType){
		bullets.load(item.weaponType);
	}
}
function addItem(details){
	var item = {};
	var name = details.name;
    $.extend(item,this.defaults);
    $.extend(item,this.list[name]);
	item.life = item.hitPoints;
	$.extend(item,details);
	return item;
}
function findAngle(object,unit,directions){
     var dy = (object.y) - (unit.y);
     var dx = (object.x) - (unit.x);
    var angle = wrapDirection(directions/2-(Math.atan2(dx,dy)*directions/(2*Math.PI)),directions);   
    return angle;    
}

function findFiringAngle(target,source,directions){
	var dy = (target.y) - (source.y);
	var dx = (target.x) - (source.x);

	if(target.type=="buildings"){
		dy += target.baseWidth/2/game.gridSize;
		dx += target.baseHeight/2/game.gridSize;
	} else if(target.type == "aircraft"){
		dy -= target.pixelShadowHeight/game.gridSize;
	}

 	if(source.type=="buildings"){
		dy -= source.baseWidth/2/game.gridSize;
		dx -= source.baseHeight/2/game.gridSize;
	} else if(source.type == "aircraft"){
		dy += source.pixelShadowHeight/game.gridSize;
	}
    var angle = wrapDirection(directions/2-(Math.atan2(dx,dy)*directions/(2*Math.PI)),directions);   
    return angle;	
}

function angleDiff(angle1,angle2,directions){
	if (angle1>=directions/2){
		angle1 = angle1-directions;
	}
	if (angle2>=directions/2){
		angle2 = angle2-directions;
	}
	
	diff = angle2-angle1; 
	
	if (diff<-directions/2){
		diff += directions;
	}
	if (diff>directions/2){
		diff -= directions;
	}
	
    return diff;
}
function wrapDirection(direction,directions){
	if (direction<0){
		direction += directions;
	}  
	if (direction >= directions){
		direction -= directions;
	}
	return direction;
}


var AStar = (function () {

    function diagonalSuccessors($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
        if($N) {
            $E && !grid[N][E] && (result[i++] = {x:E, y:N});
            $W && !grid[N][W] && (result[i++] = {x:W, y:N});
        }
        if($S){
            $E && !grid[S][E] && (result[i++] = {x:E, y:S});
            $W && !grid[S][W] && (result[i++] = {x:W, y:S});
        }
        return result;
    }

    function diagonalSuccessorsFree($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
        $N = N > -1;
        $S = S < rows;
        $E = E < cols;
        $W = W > -1;
        if($E) {
            $N && !grid[N][E] && (result[i++] = {x:E, y:N});
            $S && !grid[S][E] && (result[i++] = {x:E, y:S});
        }
        if($W) {
            $N && !grid[N][W] && (result[i++] = {x:W, y:N});
            $S && !grid[S][W] && (result[i++] = {x:W, y:S});
        }
        return result;
    }

    function nothingToDo($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
        return result;
    }

    function successors(find, x, y, grid, rows, cols){
        var
            N = y - 1,
            S = y + 1,
            E = x + 1,
            W = x - 1,
            $N = N > -1 && !grid[N][x],
            $S = S < rows && !grid[S][x],
            $E = E < cols && !grid[y][E],
            $W = W > -1 && !grid[y][W],
            result = [],
            i = 0
        ;
        $N && (result[i++] = {x:x, y:N});
        $E && (result[i++] = {x:E, y:y});
        $S && (result[i++] = {x:x, y:S});
        $W && (result[i++] = {x:W, y:y});
        return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i);
    }

    function diagonal(start, end, f1, f2) {
        return f2(f1(start.x - end.x), f1(start.y - end.y));
    }

    function euclidean(start, end, f1, f2) {
        var
            x = start.x - end.x,
            y = start.y - end.y
        ;
        return f2(x * x + y * y);
    }

    function manhattan(start, end, f1, f2) {
        return f1(start.x - end.x) + f1(start.y - end.y);
    }

    function AStar(grid, start, end, f) {
        var
            cols = grid[0].length,
            rows = grid.length,
            limit = cols * rows,
            f1 = Math.abs,
            f2 = Math.max,
            list = {},
            result = [],
            open = [{x:start[0], y:start[1], f:0, g:0, v:start[0]+start[1]*cols}],
            length = 1,
            adj, distance, find, i, j, max, min, current, next
        ;
        end = {x:end[0], y:end[1], v:end[0]+end[1]*cols};
        switch (f) {
            case "Diagonal":
                find = diagonalSuccessors;
            case "DiagonalFree":
                distance = diagonal;
                break;
            case "Euclidean":
                find = diagonalSuccessors;
            case "EuclideanFree":
                f2 = Math.sqrt;
                distance = euclidean;
                break;
            default:
                distance = manhattan;
                find = nothingToDo;
                break;
        }
        find || (find = diagonalSuccessorsFree);
        do {
            max = limit;
            min = 0;
            for(i = 0; i < length; ++i) {
                if((f = open[i].f) < max) {
                    max = f;
                    min = i;
                }
            };
            current = open.splice(min, 1)[0];
            if (current.v != end.v) {
                --length;
                next = successors(find, current.x, current.y, grid, rows, cols);
                for(i = 0, j = next.length; i < j; ++i){
                    (adj = next[i]).p = current;
                    adj.f = adj.g = 0;
                    adj.v = adj.x + adj.y * cols;
                    if(!(adj.v in list)){
                        adj.f = (adj.g = current.g + distance(adj, current, f1, f2)) + distance(adj, end, f1, f2);
                        open[length++] = adj;
                        list[adj.v] = 1;
                    }
                }
            } else {
                i = length = 0;
                do {
                    result[i++] = {x:current.x, y:current.y};
                } while (current = current.p);
                result.reverse();
            }
        } while (length);
        return result;
    }

    return AStar;

}());
function isValidTarget(item){
	return item.team != this.team && (this.canAttackLand && (item.type == "buildings" || item.type == "vehicles")|| (this.canAttackAir && (item.type == "aircraft")));
}

function findTargetsInSight(increment){
	if(!increment){
		increment=0;
	}
	var targets = [];
	for (var i = game.items.length - 1; i >= 0; i--){
		var item = game.items[i];				
		if (this.isValidTarget(item)){
			if(Math.pow(item.x-this.x,2) + Math.pow(item.y-this.y,2)<Math.pow(this.sight+increment,2)){
				targets.push(item);
			}
		}
	};
	var attacker = this;
	targets.sort(function(a,b){
        return (Math.pow(a.x-attacker.x,2) + Math.pow(a.y-attacker.y,2))-(Math.pow(b.x-attacker.x,2) + Math.pow(b.y-attacker.y,2));
   	});
	
	return targets;
}

function isItemDead(uid){
	var item = game.getItemByUid(uid);
	return (!item || item.lifeCode == "dead");
}
