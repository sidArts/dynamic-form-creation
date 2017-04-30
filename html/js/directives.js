( function(){

angular.module('app')
.directive('customInput', function($compile){
	return {
		restrict: 'E',
		scope: {
			input: "="
		},
		link: function($scope, element, attrs) {
			var inputGroup = null;
			
			switch($scope.input.type){
				case "text":
					inputGroup = $("<div>", {
						"class": "form-group"
					});
					var label = $("<label>", {
						"text": $scope.input.label
					});
					var input = $('<input>', {
						"type": "text",
						"class": "form-control",
						"ng-model": "input.value",
						"placeholder": $scope.input.placeholder	
					});
					inputGroup.append(label);
					inputGroup.append(input);
					break;
				case "textarea":
					inputGroup = $("<div>", {
						"class": "form-group"
					});
					var label = $("<label>", {
						"text": $scope.input.label
					});
					var input = $('<textarea>', {
						"class": "form-control",
						"ng-model": "input.value",
						"placeholder": 	$scope.input.placeholder
					});
					inputGroup.append(label);
					inputGroup.append(input);
					break;
				case "select":
					inputGroup = $("<div>", {
						"class": "form-group"
					});
					var label = $("<label>", {
						"text": $scope.input.label
					});
					var input = $('<select>', {
						"class": "form-control",
						"ng-model": "input.value"	
					});
					input.append($('<option>', {value: "", text: "--select--"}));
					if($scope.input.optionValues.length > 0)
					angular.forEach($scope.input.optionValues, function(element){
						var option = $('<option>', {
							"text": element.text,
							"value": element.value
						})
						input.append(option);
					});
					inputGroup.append(label);
					inputGroup.append(input);
					break;
				case "checkbox":
					inputGroup = $('<div>', { "class": "form-group"});
					var label = $('<label>', { "style":"font-weight: normal;" });
					var input = $('<input>', {
						"type": "checkbox",
						"ng-true-value": "'"+ $scope.input.checkedValue +"'",
						"ng-false-value": "'"+ $scope.input.uncheckedValue +"'",
						"ng-model": "input.value"
					});
					var span = $('<span>', { "text": " "+ $scope.input.label });
					label.append(input);
					label.append(span);
					inputGroup.append(label);
					break;
				case "radio":
					inputGroup = $("<div>", {
						"class": "form-group"
					});
					var label = $('<label>', { "text": $scope.input.label });
					inputGroup.append(label);
					angular.forEach($scope.input.values, function(element){
						var radio = $('<div>', { "class": "radio"});
						var label = $('<label>');
						var input = $('<input>', {
							"type": "radio",
							"value": element.value,
							"ng-model": "input.value"
						});
						var span = $('<span>', { "text": " "+ element.label });
						label.append(input);
						label.append(span);
						radio.append(label);	
						inputGroup.append(radio);
					});
					
					break;
				case "heading":					
					var prop = { class: "page-header" };
					prop["class"] = prop["class"] + " text-"+ $scope.input.align;
					prop["text"] = $scope.input.text;
					inputGroup = $('<h'+ $scope.input.size +'>', prop);
					break;

				/*case "empty":
					inputGroup = $("<div>", {
						"class": "form-group"
					});
					break;*/

			}
			if(inputGroup != null) {

				
				element.replaceWith(inputGroup);
				$compile(inputGroup)($scope);
			}
		}	

	}
	
})
.directive("editInput", function($compile) {
	return {
		restrict: "E",
		scope: {
			input: "="
		},
		link: function($scope, element, attrs) {

		}
	};
});


} )();