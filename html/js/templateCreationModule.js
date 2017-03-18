( function(){
angular.module('app', [])
	.controller('appController', function($scope, $http, $timeout) {

		$scope.inputTextPropertiesHidden = true;
		$scope.inputTextareaPropertiesHidden = true;
		$scope.inputSelectPropertiesHidden = true;
		$scope.inputCheckboxPropertiesHidden = true;
		$scope.formElements = [];
		$scope.editTextInputForm = {};
		$scope.editTextareaInputForm = {};
		$scope.editSelectInputForm = {};
		$scope.editCheckboxInputForm = {};
		$scope.textInput = {
			"label": "Input Label",
			"placeholder": "John Doe",
			"class": "form-control",
			"type": "text",
			"value": "",
			"displayOrder": 0
		};
		$scope.textareaInput = {
			"label": "Textarea Label",
			"placeholder": "John Doe",
			"class": "form-control",
			"type": "textarea",
			"value": "",
			"displayOrder": 0
		};
		$scope.selectInput = {
			"label": "Select Label",
			"class": "form-control",
			"type": "select",
			"value": "",
			"optionValues": [{ "value": 1, "text": "Option 1" }, { "value": 2, "text": "Option 2" }],
			"displayOrder": 0
		};
		$scope.checkboxInput = {
			"label": "Checkbox Label",
			"type": "checkbox",
			"checkedValue": "Y",
			"uncheckedValue": "N",
			"displayOrder": 0
		}
		$scope.radioGroup = {
			"label": "Radio Label",
			"type": "radio",
			"value": "F",
			"values": [{
				"label": "Value 1",
				"value": "V1"
			},{
				"label": "Value 2",
				"value": "V2"
			}],
			"displayOrder": 0
		};

		$scope.createElement = function(elementType) {
			var el = angular.copy(elementType);
			el.displayOrder = ($scope.formElements.length + 1) + '';
			console.log(el.displayOrder);
			$scope.formElements.push(el);
		};

		$scope.togglePropertiesSection = function(inputType) {
			switch(inputType) {
				case 'text':
					if($scope.inputTextPropertiesHidden){
						$scope.inputTextPropertiesHidden  = false;
						$scope.inputTextareaPropertiesHidden  = true;
						$scope.inputSelectPropertiesHidden  = true;
					}
					else
						$scope.inputTextPropertiesHidden  = true;
					break;
				case 'textarea':
					if($scope.inputTextareaPropertiesHidden) {
						$scope.inputTextareaPropertiesHidden  = false;
						$scope.inputTextPropertiesHidden  = true;
						$scope.inputSelectPropertiesHidden  = true;
					}
					else
						$scope.inputTextareaPropertiesHidden  = true;
					break;
				case 'select':
					if($scope.inputSelectPropertiesHidden) {
						$scope.inputSelectPropertiesHidden  = false;
						$scope.inputTextareaPropertiesHidden  = true;
						$scope.inputTextPropertiesHidden  = true;						
					}
					else
						$scope.inputSelectPropertiesHidden  = true;
					break;
			}
			
		}

		$scope.populateFieldPropertyForm = function(inputIndex){
			switch($scope.formElements[inputIndex].type) {
				case 'text':
					$scope.editTextInputForm = angular.copy($scope.formElements[inputIndex]);
					$scope.editTextInputForm.index = inputIndex;
					break;
				case 'textarea':
					$scope.editTextareaInputForm = angular.copy($scope.formElements[inputIndex]);
					$scope.editTextareaInputForm.index = inputIndex;
					break;
				case 'select':
					$scope.editSelectInputForm = angular.copy($scope.formElements[inputIndex]);
					$scope.editSelectInputForm.index = inputIndex;
					break;
			}
		};

		$scope.saveInputProperties = function(inputType){
			switch(inputType) {
				case 'text':
					manageDisplayOrder(angular.copy($scope.formElements[$scope.editTextInputForm.index].displayOrder), 
									   angular.copy($scope.editTextInputForm.displayOrder));
					$scope.formElements[$scope.editTextInputForm.index] = angular.copy($scope.editTextInputForm);
					delete $scope.formElements[$scope.editTextInputForm.index].index;
					break;
				case 'textarea':
					manageDisplayOrder(angular.copy($scope.formElements[$scope.editTextareaInputForm.index].displayOrder), 
									   angular.copy($scope.editTextareaInputForm.displayOrder));
					$scope.formElements[$scope.editTextareaInputForm.index] = angular.copy($scope.editTextareaInputForm);
					delete $scope.formElements[$scope.editTextareaInputForm.index].index;
					break;
				case 'select':
					manageDisplayOrder(angular.copy($scope.formElements[$scope.editSelectInputForm.index].displayOrder), 
									   angular.copy($scope.editSelectInputForm.displayOrder));
					$scope.formElements[$scope.editSelectInputForm.index] = angular.copy($scope.editSelectInputForm);
					delete $scope.formElements[$scope.editSelectInputForm.index].index;
					break;

			}

			console.log($scope.formElements);
			
		};

		var manageDisplayOrder = function(previousDo, currentDo) {
			if(currentDo != previousDo) {
				for(var x = 0; x < $scope.formElements.length; x++){
					if($scope.formElements[x].displayOrder == currentDo) {
						$scope.formElements[x].displayOrder = previousDo;
						break;
					}
				}
			}
		};

		$scope.removeFormElement = function(elementIndex){
			$scope.formElements.splice(elementIndex, 1);
			if($scope.formElements.length == 0) {
				$scope.inputTextareaPropertiesHidden  = true;
				$scope.inputTextPropertiesHidden  = true;
				$scope.inputSelectPropertiesHidden  = true;
			}
		};

		$scope.addSelectInputOption = function(){
			$scope.editSelectInputForm.optionValues.push({
				value: "",
				text: ""
			});
		};
		$scope.removeSelectOption = function(index){
			$scope.editSelectInputForm.optionValues.splice(index, 1);
		};

		$scope.saveForm = function() {
			/*var data = {
				title: "Sample Form",
				inputs: $scope.elements
			}
			$http.post('/', data)
			.then(function(res) {
				console.log(res);
			}, function(err) {
				console.log(err);
			});*/

			/*$('#formItems > li > .form-group').each(function(key,value) {
				console.log("Label ::: ", $(this).children().eq(0).text());
				console.log("Input ::: ", $(this).children().eq(1));
				
			});*/
			console.log($scope.formElements);

		};

	});
	
} )();