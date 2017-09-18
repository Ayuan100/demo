function initCurve(){
		Curve.canvasX = parseInt($('svg').offset().left);
		Curve.canvasY = parseInt($('svg').offset().top);
}
(function(){
	if(window.Curve){
		console.log('Path already exist!');
	}
	window.Curve = Curve;
	

	function Curve(outPort, outTarget){
		this.outPort 		= outPort;
		this.outTarget 		= outTarget;
		this.inPort 		= null;
		this.inTarget 		= null;
		this.path 			= null;

		this.setStartTarget(outTarget);
		this.endX			= 0;
		this.endY			= 0;
		// 新建path
		var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
		path.classList.add('curve');
		path.setAttribute('marker-end', "url(#markerArrow)");
		document.getElementsByTagName('svg')[0].appendChild(path);
		this.path = path;
		// console.log('new path');
		// console.log($(path));
	}

	Curve.prototype.setPathId = function(id) {
		this.path.setAttribute('id', id);
	};

	Curve.prototype.setEnd = function(endX, endY){
		// console.log('setEnd:', endX, endY);
		this.endX = endX - Curve.canvasX;
		this.endY = endY - Curve.canvasY;	
	};
	Curve.prototype.setStartTarget = function(target){
		this.startX = target.offset().left + target.width()/2 + 0 - Curve.canvasX;
		this.startY = target.offset().top + target.height()/2 + 1.5- Curve.canvasY;
	}
	Curve.prototype.setEndTarget = function(target){
		this.endX = target.offset().left + target.width()/2 + 0 - Curve.canvasX;
		this.endY = target.offset().top + target.height()/2 - 5- Curve.canvasY;
	};
	Curve.prototype.paint = function(){
		var middleX = (this.startX + this.endX)/2,
			middleY = (this.startY + this.endY)/2,
			extraX = this.startX,
			extraY = (this.startY + middleY)/2,
			data = 'M' + this.startX + ' ' + this.startY + ' ' +
					   'Q ' + extraX + ' ' + extraY + ' ' + middleX + ' ' + middleY + ' ' +
					   'T ' + this.endX	  + ' ' + this.endY ;
		// console.log('curve paint:', data);
		// console.log(this.startX, this.startY, this.endX, this.endY);
		this.path.setAttribute('d', data);
	};
	Curve.prototype.repaint = function(){
		if(this.outTarget){
			this.setStartTarget(this.outTarget);
		}
		if(this.inTarget){
			this.setEndTarget(this.inTarget);
		}
		this.paint();
	}
	Curve.prototype.save = function(inPort, inTarget){
		this.inPort 	= inPort;
		this.inTarget 	= inTarget;
		// setPathId(path, outPortInfo.id)

		// focus时两端的port要高亮
		$(this.path).click(function(e){
			// console.log('svg click');
			View.setFocus(this.outTarget,this.inTarget);
		});
		// 设置了focus事件才能捕获keydown why？？？
		$(this.path).focus(function(e){
		});
		var curve = this;
		$(this.path).keydown(function(e){
			// console.log('svg keydown');
			if(e.keyCode == 8){
				curve.delete();
				
			}
		});
	};
	Curve.prototype.delete = function(){
		// Path.deletePath(path);
		if(!this.path){ 
			console.log('deletePath: path not exist!');
			return;
		}
		if(this.path.parentNode){
			// console.log('delete path');
			this.path.parentNode.removeChild(this.path);
		}
		if(this.outPort) this.outPort.disconnect();
		if(this.inPort) this.inPort.disconnect();
		if(this.outTarget) View.setDisconnected(this.outTarget);
		if(this.inTarget) View.setDisconnected(this.inTarget);
		View.unFocus();
	}
	// Curve.setPath = function(path, startX, startY, endX, endY) {
		
	// 	var middleX = (startX + endX)/2,
	// 		middleY = (startY + endY)/2,
	// 		extraX = startX,
	// 		extraY = (startY + middleY)/2;
	// 		data = 'M' + startX + ' ' + startY + ' ' +
	// 				   'Q ' + extraX + ' ' + extraY + ' ' + middleX + ' ' + middleY + ' ' +
	// 				   'T ' + endX	  + ' ' + endY ;
	// 	path.setAttribute('d', data);	
	// 	// console.log('setPath: ', data);
	// 	// 	console.log(path);

	// 	// target.attr('d', 'M' + startX + ' ' + startY + ' ' +
	// 	// 			   'Q ' + extraX + ' ' + extraY + ' ' + middleX + ' ' + middleY + ' ' +
	// 	// 			   'T ' + endX	  + ' ' + endY );
	// 	// $("svg").html($("svg").html());
	// };

	// Curve.deletePath = function(path){
	// 	// console.log('delete path');
	// 	// console.log($(path));
	// 	// console.log(path.parentNode);
		
	// };
})();