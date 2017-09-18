(function(){
	var View = {};
	if(window.View){
		console.log('View existed!');
	}
	window.View = View;
	
	View.init = function(models) {
		View.models = models;
		// 从model生成左边栏
		for(var i = 0; i < models.length; i++){
			View.createModelNode(models[i]);
		}
	};
	// 从model生成左边栏里的元素，挂在parent下
	View.createModelNode = function(model){
		var newNode = $('#node-template').template(model).appendTo('#left');
		newNode.attr('id',model.id);
		newNode.addClass('node-model');
		addModelEvent(model);
	};
	// 从node生成元素，挂在body下
	View.createNode = function(node){
		// console.log('create node element with id:' + node.id);
		var newNode = $('#node-template').template(node).appendTo('body');
		newNode.attr('id',node.id);
		newNode.addClass('node-instance');
		// newNode.addClass('lightup');
	};
	View.regularNode = function(node, oldId){
		// console.log(node);
		var element = $('#'+ oldId);
		// 更新ID以免重复
		element.attr('id', node.id);
		
		// 更新index
		element.find('.index').text(node.index+1);
		// 从body移动到画布#center
		$('#center').append(element);
		// console.log(element);

		// 添加输入和拖动事件
		var input = element.find('.name');
		addInputEvent(node, input);
		addNodeEvent(node);
		addKeydownEvent(node);
	};
	// hover某个node的所有in-port
	View.lightupPorts = function(node){
		var target = $('#'+node.id);
		target.find('.in-ports').find('.port').addClass('hover');
	};

	// 熄灭某个node的所有in-port
	View.restorePorts = function(node){
		var target = $('#'+node.id);
		target.find('.hover').removeClass('hover');
	};

	// 查询port状态
	View.isPort = function(target){
		return target.hasClass('port');
	};
	View.isInport = function(target){
		// console.log( target.parent('.in-ports') );
		if (target.hasClass('port') && target.parent('.in-ports').length>0 ) return true;
		return false;
	};
	View.isOutport = function(target){
		// console.log( target.parent('.out-ports') == true);
		if (target.hasClass('port') && target.parent('.out-ports').length>0 ) return true;
		return false;
	};
	View.isConnected = function(target){
		return target.hasClass('connected');
	};

	View.getPort = function(target){
		var port = null;
		if(target.hasClass('port')){
			var parent = target.parent('.in-ports');
			if(parent.length == 0) parent = target.parent('.out-ports');
			if(parent.length > 0){
				var grandpa = parent.parent('.node')[0];
				// console.log(grandpa);
				if(grandpa){
					var node = Model.searchNodeById(grandpa.id);
					// console.log(grandpa.id);
					if(node){	
						var index = (target.index()+2)/3 - 1;
						if(View.isInport(target)) port = node.inports[index];
						if(View.isOutport(target)) port = node.outports[index];
						
					}
				}
			}
		}
		// console.log(port);
		return port;
	};
	View.disconnectPort = function(port){
		var target = $('#'+port.node.id).find(port.type).find('.port').eq(port.id);
		// console.log(target);
		View.setDisconnected(target);
		
	}
	View.setConnected = function(target){
		target.removeClass('unconnected');
		target.addClass('connected');
	};
	View.setDisconnected = function(target){
		target.removeClass('connected');
		target.addClass('unconnected');
	};

	// 把target放置在scope范围内，x,y为鼠标坐标，offsetX，offsetY为开始拖动时鼠标相对target的位置
	View.moveNode = function(target, scope, x , y, offsetX, offsetY){
		// 画布的基准坐标
		var left = scope.offset().left;    
	    var top = scope.offset().top;
		var right = left + scope.width();
		var bottom = top + scope.height();

	    // 目标位置 = 鼠标位置-画布基准坐标-鼠标相对target的位置
	    var moveLeft = x - offsetX;
	    var moveTop = y - offsetY;
	    var moveRight = moveLeft + target.width();
	    var moveBottom = moveTop + target.height();
	    // console.log('move to ', moveLeft, moveTop);
	    // 在可拖动范围内移动
	    if( moveLeft > left &&
	    	moveTop > top &&
	    	moveRight < right &&
	    	moveBottom < bottom){
	    		// moveLeft -= scope.offset().left;
	    		// moveTop -= scope.offset().top;
	        	target.css({
					"left": moveLeft + 'px', 
					"top": moveTop + 'px'
					});
	    }

	    // 还要移动相应的path！

			
	};
	// 判断target是否在scope的元素区域内
	View.isInside = function(target, scope){
		var container = $('#' + scope);
		var left1 = container.offset().left;
		var top1 = container.offset().top;
		var right1 = left1 + container.width();
		var bottom1 = top1 + container.height();

		var element = $('#' + target);
		var left2 = element.offset().left;
		var top2 = element.offset().top;
		var right2 = left2 + element.width();
		var bottom2 = top2 + element.height();
		// console.log(left, top, right, bottom, 'x,y:', x, y);
		if(left2 > left1 &&
			top2 > top1 &&
			right2 < right1 &&
			bottom2 < bottom1) return true;
		return false;
	};
	var currentFocusTarget = [];
	View.setFocus = function(target1, target2){
		for(var i = 0; i < currentFocusTarget.length; i++){
			currentFocusTarget[i].removeClass('lightup');
		}
		currentFocusTarget = [];
		if(target1){
			currentFocusTarget.push(target1);
			// console.log(target1);
			target1.addClass('lightup');
		}
		if(target2){
			currentFocusTarget.push(target2);
			// console.log(target);
			target2.addClass('lightup');
		}
		// console.log(currentFocusTarget);
	};
	View.getFocus = function(){
		return currentFocusTarget;
	};
	View.unFocus = function(){
		for(var i = 0; i < currentFocusTarget.length; i++){
			currentFocusTarget[i].removeClass('lightup');
		}
		currentFocusTarget = [];
	}
	View.deleteNode = function(node){
		$('#'+node.id).remove();
	};
	// $(document).keydown(function(e){
	// 			// console.log('keydown');
	// 			if(e.keyCode == 8){
	// 				outPort.disconnect();
	// 				inPort.disconnect();
	// 				View.setDisconnected(outTarget);
	// 				View.setDisconnected(inTarget);
	// 				console.log('onkeydown');
	// 				console.log(path);
	// 				Path.deletePath(path);
	// 			}
	// 		});
})();
