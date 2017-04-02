( function(){
angular.module('app', [])
	.controller('appController', function($scope, $http) {

		$scope.form = {};
		$scope.form.title = 'Sample Form';
		$scope.form.viewMode = 'Single Column View';
		$scope.formElements = [];

		$scope.editInputModel = {};
		$scope.editInputIndex = 0;
		
		$scope.users = [{
			name: "sid",
			email: "sid@mail"
		},{
			name: "abc",
			email: "abc@mail.com"
		}, {
			name: "xyz",
			email: "ddskl"
		}];
		
		$scope.textInput = {
			"label": "Input Label",
			"placeholder": "John Doe",
			"class": "form-control",
			"type": "text",
			"value": ""
		};
		$scope.textareaInput = {
			"label": "Textarea Label",
			"placeholder": "John Doe",
			"class": "form-control",
			"type": "textarea",
			"value": ""
		};
		$scope.selectInput = {
			"label": "Select Label",
			"class": "form-control",
			"type": "select",
			"value": "",
			"optionValues": [{ "value": 1, "text": "Option 1" }, { "value": 2, "text": "Option 2" }]
		};
		$scope.checkboxInput = {
			"label": "Checkbox Label",
			"type": "checkbox",
			"checkedValue": "Y",
			"uncheckedValue": "N",
			"value":""
		}
		$scope.radioGroup = {
			"label": "Radio Label",
			"type": "radio",
			"value": "",
			"values": [{
				"label": "Value 1",
				"value": "V1"
			},{
				"label": "Value 2",
				"value": "V2"
			}]
		};

		

		$scope.createElement = function(elementType) {
			var el = angular.copy(elementType);
			el.displayOrder = ($scope.formElements.length + 1) + '';
			console.log(el.displayOrder);
			$scope.formElements.push(el);
		};

		$scope.editInput = function(input, inputIndex){
			
			$scope.editInputIndex = inputIndex;
			$scope.editInputModel = angular.copy(input);

			$scope.editInputIndex = inputIndex;
			console.log('Editing TExt input form ::: ',$scope.editTextInputForm);

		};

		$scope.saveInputProperties = function(){
			
			$scope.formElements[$scope.editInputIndex] = angular.copy($scope.editInputModel);
			console.log('Edit Model ::: ',$scope.editInputModel);
			
		};

		

		$scope.removeFormElement = function(elementIndex){
			
			$scope.formElements.splice(elementIndex, 1);
			if($scope.formElements.length == 0)
				$scope.hideInputPropertiesSection();
			
		};

		$scope.addSelectInputOption = function(){
			$scope.editInputModel.optionValues.push({
				value: "value",
				text: "option"
			});
		};

		$scope.addRadioInputOption = function(){
			$scope.editInputModel.values.push({
				value: "value",
				label: "option"
			});
		};
		$scope.removeSelectOption = function(index){
			$scope.editInputModel.optionValues.splice(index, 1);
		};
		$scope.removeRadioOption = function(index){
			$scope.editInputModel.values.splice(index, 1);
		};

		$scope.moveUp = function(index){
			var temp = angular.copy($scope.formElements[index]);
			$scope.formElements[index] = angular.copy($scope.formElements[index - 1]);
			$scope.formElements[index - 1] = temp;
		};

		$scope.moveDown = function(index){
			var temp = angular.copy($scope.formElements[index]);
			$scope.formElements[index] = angular.copy($scope.formElements[index + 1]);
			$scope.formElements[index + 1] = temp;	
		};

		$scope.saveForm = function() {
			console.log($scope.formElements);
			var data = angular.copy($scope.form);
			data.inputs = angular.copy($scope.formElements);
			$http.post('/api/saveTemplate', data, {
				headers: {
					'x-access-token': document.navigation.token.value
				}
			})
			.then(function(res) {
				console.log(res);
			}, function(err) {
				console.log(err);
			});
			

		};

		$scope.viewJson = function(){
			$('#jsonViewModalBody').html('<pre>'+JSON.stringify(angular.copy($scope.formElements), null, 4)+ '</pre>');
			$('#jsonView').modal('show');
		};

		$scope.hideInputPropertiesSection = function() {
			$scope.editInputModel = {};
		};

		$scope.goto = function(page){
			document.navigation.action = '/api/'+page;
			document.navigation.submit();
		};

	});
	
} )();