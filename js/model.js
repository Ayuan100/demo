function initModels(input){
	var models = new Array(input.length);
	for (var i = 0; i < input.length; i++) {
		models[i] = new Model(input[i]);
	}
	Model.allModels= models;
	return models;
}
function Model(json){
	this.type = json.type;
	this.inPortNumber = json.inPortNumber;
	this.outPortNumber = json.outPortNumber;
	this.nodes = [];
	this.count = 0;
	
};
Model.prototype.add = function(node){
	this.nodes.push(node);
	this.count++;
	return this.nodes.length;
};
Model.lightupPortsFor = function(node){
	var models = this.allModels;
	// 遍历所有model和node
	for( var i = 0; i < models.length; i++ ){
		var nodes = models[i].nodes;
		for( var j = 0; j < nodes.length; j++){
			nodes[j].lightupPortsFor(node);
		}
	}
};
Model.restorePorts = function(){
	var models = this.allModels;
	// 遍历所有model和node
	for( var i = 0; i < models.length; i++ ){
		var nodes = models[i].nodes;
		for( var j = 0; j < nodes.length; j++){
			nodes[j].restorePorts();
		}
	}
}
Model.searchNodeById = function(id){
	var models = this.allModels;
	// 遍历所有model和node
	for( var i = 0; i < models.length; i++ ){
		var nodes = models[i].nodes;
		for( var j = 0; j < nodes.length; j++){
			if(nodes[j].id == id) return nodes[j];
		}
	}
	return null;
}
