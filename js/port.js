function Port(node, id, type){
	this.node = node;
	this.id = id;
	this.type = type;
	this.connectedPort = null;
	this.isConnect = false;
	this.path = null;
}
Port.prototype.connectTo = function(port, path){
	this.connectedPort = port;
	this.isConnect = true;
	this.path = path;
}
Port.prototype.check = function(inport){
	if(inport){
		if(inport.node.id != this.node.id) return true;
	}
	return false;
}
Port.prototype.disconnect = function(){
	// console.log(this);
	var connectedPort = this.connectedPort;
	var path = this.path;

	if(path) Path.deletePath(this.path);
	this.connectedPort = null;
	this.path = null;
	if(this.isConnect){
		this.isConnect = false;
		View.disconnectPort(this);
	}

	if(connectedPort){
		connectedPort.disconnect();
	}
}

Port.connect = function(outport, inport, path){
	// console.log('connect ', outport, inport);
	outport.connectTo(inport, path);
	inport.connectTo(outport, path);
	// console.log('connect ', outport, inport);
}