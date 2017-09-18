function addModelEvent(model){
	var target = $('#'+model.id);
	// console.log('addModelEvent',target);
	// target.focus(function(e){
		// console.log('focused');
	// });
	// 鼠标按下时变亮，开始可拖动模式
	target.mousedown(function(e){
		// target.addClass('lightup');
		// console.log('click');
		// 在body范围内可移动
        var scope = $('body');
		//记录鼠标相对node的坐标 
        var offsetX = e.pageX - target.offset().left;
        var offsetY = e.pageY - target.offset().top;

        var newNode;       

        // 鼠标开始拖动时创建新node并移动
		$(document).mousemove(function(e){
			e.preventDefault();
			// 创建node instance元素
            if(!newNode){
        		newNode = new Node(model);
        		View.setFocus($('#'+newNode.id));
            }
            
			View.moveNode($('#'+newNode.id), scope, e.pageX, e.pageY, offsetX, offsetY);
			return false;
		});
		// 鼠标松开结束拖动模式，放下newNode
		$(document).mouseup(function(e){
			// console.log(target);
			// target.removeClass('lightup');
			if(newNode){
				// $('#'+newNode.id).removeClass('lightup');

				if(View.isInside(newNode.id, 'center')){
					newNode.regular();	
				}
				else{
					newNode.delete();
				}
			}
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
		});
	});
	
}
function addNodeEvent(node){
	var target = $('#'+node.id);
	// 鼠标按下时变亮，开始可拖动模式
	target.mousedown(function(e){
		// console.log(e.target);
		e = e || window.event;
		// 不是鼠标左键，不处理
		if(e.which != 1){
			return;
		}
		var mousedownTarget = $(e.target);

		// 点击了可编辑区域，不反应
		// console.log(mousedownTarget);
		if(mousedownTarget.hasClass('name')){
			return;
		} 
		// 如果点到in-port或者unconnected，不反应
		if(View.isInport(mousedownTarget) || View.isConnected(mousedownTarget) ){
			return false;
		}

		// 如果是点击到out-port且unconnected，准备进入connect模式
		if(View.isOutport(mousedownTarget)){
			View.setFocus(mousedownTarget);
			// console.log(e.target);
			var outPort = View.getPort(mousedownTarget);
			if(outPort==null){
				console.log('something is wrong!!!');
				return false;
			}
			
			// console.log(e.pageX, e.pageY, target.offset().left, target.offset().top);
			
			
			// connect模式
			mousedownTarget.addClass('hover');
			Model.lightupPortsFor(node);

			var curve = null;
			// 判断鼠标移动到的port，创建path并随鼠标移动
			$(document).mousemove(function(e){
				// console.log(e);

				// 准备画线
				if(!curve){
					curve = new Curve(outPort, mousedownTarget);
					// 刚开始拖动，先不paint
					return;
				}
				else curve.setEnd(e.pageX, e.pageY);

				var mousemoveTarget = $(e.target);
				// 鼠标移到可连接的inport上时，自动计算连线位置
				if(View.isInport(mousemoveTarget) && !View.isConnected(mousemoveTarget)){
					// console.log(target.parent());
					var inPort = View.getPort(mousemoveTarget);
					if(inPort == null){
						console.log('something is wrong!!!');
						return false;
					}
					// console.log(inPort);
					// console.log(inNodeInfo);
					if(outPort.check(inPort)){
						curve.setEndTarget(mousemoveTarget);
					}	
				}
				curve.paint();	
			});
			// 松开鼠标 - 完成连线并还原ports
			$(document).mouseup(function(e){
				var mouseupTarget = $(e.target);
				var flag = false;
				// 鼠标移到可连接的port上时，完成连线
				if(View.isInport(mouseupTarget) && !View.isConnected(mouseupTarget)){
					// console.log(target.parent());
					// console.log(target.parent('.in-port'));
					var inPort = View.getPort(mouseupTarget);
					// console.log('llll',inPort);
					if(outPort.check(inPort)){
						flag = true;
						Port.connect(outPort, inPort, curve);
						View.setConnected(mousedownTarget);
						View.setConnected(mouseupTarget);
						if(curve) curve.save(inPort, mouseupTarget);
						// Path.savePath(path, outPort, inPort, mousedownTarget, mouseupTarget);
						// 设置当前连线获得焦点，两端port高亮
						View.setFocus(mousedownTarget, mouseupTarget);
					}
				}
				if(curve && flag==false ) curve.delete();
					// Path.deletePath(path);
				Model.restorePorts();
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');

			});
			return false;
		}
		else{
			// 其他情况下进入drag模式
			// node高亮
			View.setFocus(target);
			// 在center画布范围内可移动
            var scope = $('#center');
			//记录鼠标相对node的坐标 
            var myX = e.pageX - target.offset().left;
            var myY = e.pageY - target.offset().top;
            
            // 鼠标拖动时移动
			$(document).mousemove(function(e){

				View.moveNode(target, scope, e.pageX, e.pageY, myX, myY);
				node.movePorts();
				return false;
			});
		
			// 鼠标松开结束drag
			$(document).mouseup(function(e){

				// target.removeClass('lightup');用focus代替？
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			});
		}
	});	
}
// input变化时更新node的name
function addInputEvent(node, input){
	input.change(function(e){
		// console.log($(e.target).text());
		// console.log(e);
		node.name = input.val();
	});
}
// 在node上监听删除键
function addKeydownEvent(node){
	// console.log('addFocusEvent');
	var target = $('#'+node.id);
	// console.log(target);

	target.keydown(function(e){
		// console.log('keydown');
		// 忽略输入框里的键盘事件
		if($(e.target).hasClass('name')) return;

		if(e.keyCode == 8){
			node.delete();
		}
	});
}