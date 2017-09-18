
$(function(){
	$.getJSON('data/models.json', function(result){
		var models = initModels(result);
		View.init(models);
		initCurve();
		// console.log(models);

		// var newNode1 = new Node(Model.allModels[0]);
		// newNode1.regular();
		// // console.log(newNode1);
		// View.moveNode($('#'+newNode1.id), $('#center'), 500, 300, 0, 0);
		
		
		// var newNode2 = new Node(Model.allModels[1]);
		// newNode2.regular();
		// console.log(newNode1);
		// View.moveNode($('#'+newNode2.id), $('#center'), 500, 200, 0, 0);

		$('#export').mousedown(function(e){
			console.log('click');
			Model.export();

		});
	});
		
});

