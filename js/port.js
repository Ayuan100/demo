function Port(node, id, type){
	this.node = node;
	this.id = node.id + '-' + type + '-' + id;
	this.type = type;
	this.isConnect = false;
	this.connectedPort = null;
	this.curve = null;
}
Port.prototype.connectTo = function(port, curve){
	this.connectedPort = port;
	this.isConnect = true;
	this.curve = curve;
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
	var curve = this.curve;

	this.connectedPort = null;
	this.curve = null;
	if(this.isConnect){
		this.isConnect = false;
		View.disconnectPort(this);
	}

	if(curve) curve.delete();
	if(connectedPort){
		connectedPort.disconnect();
	}
}
Port.prototype.move = function(){
	if(this.isConnect){
		this.curve.repaint();
	}
}
Port.connect = function(outport, inport, path){
	// console.log('connect ', outport, inport);
	outport.connectTo(inport, path);
	inport.connectTo(outport, path);
	// console.log('connect ', outport, inport);
}