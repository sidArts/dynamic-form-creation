( function(){
angular.module('app', [])
	.controller('appController', function($scope, $http, $window) {

		$scope.isArray = angular.isArray;
		$scope.isObject = angular.isObject;

		var init = function(){
			$http.get('/api/form/'+ $window.formId,{
            headers: {
              'x-access-token': document.navigation.token.value
            }
          	}).then(function(res){
        	 	console.log(res.data);
        	 	$scope.form._id = res.data._id;
                $scope.form.title = res.data.title;
                $scope.form.viewMode = res.data.viewMode;
                $scope.formElements  = res.data.inputs;
        	}, function(err){
        	 	console.log(err);
        	});
		};

		if($window.formId != undefined && $window.formId != '') {
			init();
		}

		$scope.form = {};
		$scope.form.viewMode = 'Single Column View';
		$scope.formElements = [];

		$scope.preview = [];

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

		$scope.heading = {
			"type": "heading",
			"text": "Heading 1",
			"align": "center",
			"size": "1"
		};

		
		

		$scope.createElement = function(elementType) {
			var el = angular.copy(elementType);
			el.displayOrder = ($scope.formElements.length + 1) + '';
			
			$scope.formElements.push(el);
			
			$scope.sortFormElements();

			console.log($scope.preview);
				
		};

		$scope.sortFormElements = function() {
			$scope.preview = [];
			if($scope.form.viewMode == 'Double Column View') {
				var counter = 0;
				var length = $scope.formElements.length/2;
				for(var i = 0; i < length; i++) {
					$scope.preview[i] = [];
					for(var j = 0; j < 2; j++) {
						if($scope.formElements[ counter ] != undefined) {
							if( $scope.formElements[ counter ].type == 'heading' ) {
								if($scope.preview[i].length == 0) {									
									$scope.preview[i] = angular.copy($scope.formElements[ counter++ ]);
									length++;
								} else if($scope.preview[i].length == 1) {
									$scope.preview[i].push(undefined);
									length++;
								}								
								break;	
							} else {
								$scope.preview[ i ].push(angular.copy($scope.formElements[ counter++ ]));	
							}
						}

							
					}
				}
			} else {
				$scope.preview = angular.copy($scope.formElements);
			}
		};

		$scope.editInput = function(input, inputIndex){
			
			$scope.editInputIndex = inputIndex;
			$scope.editInputModel = angular.copy(input);
			console.log('Editing TExt input form ::: ',$scope.editTextInputForm);
			$('#editInputPropertiesModal').modal('show');

		};

		$scope.saveInputProperties = function(){
			
			$scope.formElements[$scope.editInputIndex] = angular.copy($scope.editInputModel);
			console.log('Edit Model ::: ',$scope.editInputModel);
			$('#editInputPropertiesModal').modal('hide');			
			$scope.sortFormElements();
		};

		

		$scope.removeFormElement = function(elementIndex){
			
			if(confirm('Are You sure want to remove this form element?'))
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
			$scope.sortFormElements();
			console.log('Form Elements ::: ', $scope.formElements);
			console.log($scope.preview);
		};

		$scope.moveDown = function(index){
			var temp = angular.copy($scope.formElements[index]);
			$scope.formElements[index] = angular.copy($scope.formElements[index + 1]);
			$scope.formElements[index + 1] = temp;	
			$scope.sortFormElements();
			console.log('Form Elements ::: ', $scope.formElements);
			console.log($scope.preview);
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