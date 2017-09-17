$.getJSON('data/models.json', function(result){
	var models = initModels(result);
	View.init(models);
	// console.log(models);
// NodeView.createModelNode();
	// var newNode1 = new Node(Model.allModels[0]);
	// newNode1.regular();
	// // console.log(newNode1);
	// move($('#'+newNode1.id), $('#center'), 500, 300, 0, 0);

	// var newNode2 = new Node(Model.allModels[1]);
	// newNode2.regular();
	// // console.log(newNode1);
	// move($('#'+newNode2.id), $('#center'), 500, 200, 0, 0);
	// console.log(Model);
	// Model.lightupPortsFor(newNode1);
	// Model.restorePorts();
	$('.name').focus(function(e){
		console.log('focus');
	});
	
});

