function Node(model, name){
	if(!model){
		console.log('cannot create node from empty model');
		return;
	}
	name = name || '';
	// console.log('create node: '+name);
	this.model = model;
	this.name = name;
	this.id = model.type + '-' + name;
	this.index = -1;
	this.inports = new Array(model.inPortNumber);
	for(var i = 0; i < this.inports.length; i++){
		this.inports[i] = new Port(this, i, '.in-ports');
	}
	this.outports = new Array(model.outPortNumber);
	for(var i = 0; i < this.outports.length; i++){
		this.outports[i] = new Port(this, i, '.out-ports');
	}
	View.createNode(this);
};
Node.prototype.delete = function(){
	if(this.index >=0){
		for(var i = 0; i < this.inports.length; i++){
			this.inports[i].disconnect();
		}
		for(var i = 0; i < this.outports.length; i++){
			this.outports[i].disconnect();
		}
	}
	View.deleteNode(this);
	if(this.index >=0) this.model.nodes.splice(this.index, 1);
	
	// toadd
};
// 转为画布区的正式node
Node.prototype.regular = function(){
	// 加到所在的model队列中
	this.index = this.model.add(this)-1;
	var oldId = this.id;
	this.id = this.model.type + '-' + this.model.count;
	this.name = this.model.count;
	
	View.regularNode(this, oldId);
};
Node.prototype.lightupPortsFor = function(node){
	if(this.id == node.id) return; 
	View.lightupPorts(this);
}
Node.prototype.restorePorts = function(node){
	View.restorePorts(this);
}
Node.prototype.connectTo = function(path, outId, node, inId){
	console.log(this.id, ' port ', outId, ' connected to ', node.id, ' port ', inId)
	if(this.outports[outId].isConnect || node.inports[inId].isConnect) {
		console.log('already connected, why???');
	}
	// 设置输出口
	this.outports[outId].node = node;
	this.outports[outId].port = inId;
	this.outports[outId].isConnect = true;
	this.outports[outId].path = path;
	//设置输入口
	node.inports[inId].node = this;
	node.inports[inId].port = outId;
	node.inports[inId].isConnect = true;
	node.inports[inId].path = path;

	Path.savePath(path, this.outports[outId], node.inports[inId]);
	return true;
}
