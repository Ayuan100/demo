(function(){
	var Path = {};
	if(window.Path){
		console.log('Path already exist!');
	}
	window.Path = Path;
	Path.newPath = function(startX, startY, endX, endY){
		// console.log('newPath: ', startX, startY, endX, endY);
		// var canvas = $('svg');
		// var path = $('<path />');
		// path.addClass('curve');
		// // console.log(canvas);
		// setPath(path, startX, startY, endX, endY);
		// canvas.append(path);
		// // 需要强制刷新svg才能显示新的path
		// $("svg").html($("svg").html());
		
		// 方法二
		var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
		path.classList.add('curve');
		path.setAttribute('marker-end', "url(#markerArrow)");
		document.getElementsByTagName('svg')[0].appendChild(path);
		console.log('new path');
		console.log($(path));
		return path;
	};
	Path.setPathId = function(path, id) {
		path.setAttribute('id', id);
	};
	Path.savePath = function(path, outPort, inPort, outTarget, inTarget){
		// setPathId(path, outPortInfo.id)
		$(path).click(function(e){
			console.log('svg click');
			View.setFocus(outTarget,inTarget);
		});
		$(path).keydown(function(e){
			console.log('svg keydown');
			if(e.keyCode == 8){
				Path.deletePath(path);
				outPort.disconnect();
				inPort.disconnect();
				View.setDisconnected(outTarget);
				View.setDisconnected(inTarget);
				$(document).unbind('keydown');
			}
		});
	};

	Path.setPath = function(path, startX, startY, endX, endY) {
		
		var middleX = (startX + endX)/2,
			middleY = (startY + endY)/2,
			extraX = startX,
			extraY = (startY + middleY)/2;
			data = 'M' + startX + ' ' + startY + ' ' +
					   'Q ' + extraX + ' ' + extraY + ' ' + middleX + ' ' + middleY + ' ' +
					   'T ' + endX	  + ' ' + endY ;
		path.setAttribute('d', data);	
		// console.log('setPath: ', data);
		// 	console.log(path);

		// target.attr('d', 'M' + startX + ' ' + startY + ' ' +
		// 			   'Q ' + extraX + ' ' + extraY + ' ' + middleX + ' ' + middleY + ' ' +
		// 			   'T ' + endX	  + ' ' + endY );
		// $("svg").html($("svg").html());
	};

	Path.deletePath = function(path){
		// console.log('delete path');
		// console.log($(path));
		// console.log(path.parentNode);
		if(!path){ 
			console.log('deletePath: path not exist!');
			return;
		}
		if(path.parentNode){
			console.log('delete path');
			path.parentNode.removeChild(path);
		}
	};
})();

// setPath($('#path'), {x:10, y:400}, {x:400, y:10});