function initModels(input){
	var models = new Array(input.length);
	for (var i = 0; i < input.length; i++) {
		models[i] = new Model(input[i], i);
	}
	Model.allModels= models;
	return models;
}
function Model(json, index){
	this.type = json.type;
	this.id = 'model-' + index;
	this.count = 0;
	this.inPortNumber = json.inPortNumber;
	this.outPortNumber = json.outPortNumber;
	this.nodes = [];
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
};
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
};
Model.replacer = function(key, value){
	// console.log('key:',key);
	switch(key){
		case 'connectedPort':
			// console.log(value);
			if(value) value = value.id;
			else return;
			// console.log(value);
			return value;
		case 'type':
			if(value == 'inports' || value == 'outports')
				return;
		case 'model':
		case 'node':
		case 'curve':
				value = undefined;
				break;
		default: return value;
	}
}
Model.export = function(){
	var data = JSON.stringify(Model.allModels, Model.replacer, 2);

	var eleLink = document.createElement('a');
    eleLink.download = 'export.json';
    eleLink.style.display = 'none';

    var blob = new Blob([data],{type : 'application/json'});
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    window.open(eleLink.href);
    // 然后移除
    document.body.removeChild(eleLink);
}

