( function () {
	angular.module('app', [])
	.controller('appController', function($scope, $http, $window) {

		$scope.isObject = angular.isObject;
		$scope.isArray = angular.isArray;

		$scope.template = {};
		
		$scope.template.title = {};
		$scope.template.title.align = 'center';

		$scope.template.sections = [];

		$scope.section = {};
		$scope.section.heading = {};
		$scope.section.name = 'Section '+ ($scope.template.sections.length + 1 );
		$scope.section.heading.align = 'center';
		$scope.section.viewMode = "101";
		$scope.section.formElements = [];

		$scope.model = {};

		$scope.preview = {};

		// $scope.model.selectedSection = 0;

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

		var init = function(){
			$http.get('/api/form/'+ $window.formId,{
            headers: {
              'x-access-token': document.navigation.token.value
            }
          	}).then(function(res){
        	 	console.log(res.data);
        	 	$scope.template = res.data;
        	 	changeDisplayLayout();
                console.log($('#jscolor'));
                $('#jscolor').trigger('change');
        	}, function(err){
        	 	console.log(err);
        	});
		};

		if($window.formId != undefined && $window.formId != '') {
			init();
		}

		$scope.addSection = function() {
			
			$scope.template.sections.push(angular.copy($scope.section));
			$("#collapseTwo").collapse("hide");
			$("#collapseThree").collapse("show");
			$scope.model.selectedSection = ($scope.template.sections.length - 1) + '';
			$scope.section = {};
			$scope.section.heading = {};
			$scope.section.name = 'Section '+ ($scope.template.sections.length + 1 );
			$scope.section.heading.align = 'center';
			$scope.section.viewMode = "101";
			$scope.section.formElements = [];

			changeDisplayLayout();

		};

		$scope.createElement = function(elementType) {
			
			var el = angular.copy(elementType);
			el.displayOrder = ($scope.template.sections[$scope.model.selectedSection].formElements.length + 1) + '';
			
			$scope.template.sections[$scope.model.selectedSection].formElements.push(el);
			
			/*$scope.sortFormElements();

			console.log($scope.preview);

			console.log(document.getElementsByClassName("element-li"));*/
			changeDisplayLayout();
				
		};

		$scope.moveUp = function(elementIndex, sectionIndex){
			var temp = angular.copy($scope.template.sections[sectionIndex].formElements[elementIndex]);
			$scope.template.sections[sectionIndex].formElements[elementIndex] = angular.copy($scope.template.sections[sectionIndex].formElements[elementIndex - 1]);
			$scope.template.sections[sectionIndex].formElements[elementIndex - 1] = temp;
			// $scope.sortFormElements();
			// console.log('Form Elements ::: ', $scope.formElements);
			// console.log($scope.preview);
			changeDisplayLayout();
		};

		$scope.moveDown = function(elementIndex, sectionIndex){
			var temp = angular.copy($scope.template.sections[sectionIndex].formElements[elementIndex]);
			$scope.template.sections[sectionIndex].formElements[elementIndex] = angular.copy($scope.template.sections[sectionIndex].formElements[elementIndex + 1]);
			$scope.template.sections[sectionIndex].formElements[elementIndex + 1] = temp;	
			/*$scope.sortFormElements();
			console.log('Form Elements ::: ', $scope.formElements);
			console.log($scope.preview);*/
			changeDisplayLayout();
		};

		$scope.removeFormElement = function(elementIndex, sectionIndex){
			
			if(confirm('Are You sure want to remove this form element?'))
				$scope.template.sections[sectionIndex].formElements.splice(elementIndex, 1);
			
			// $scope.sortFormElements();
			changeDisplayLayout();
		};

		var editInputIndex = 0;
		var editSectionIndex = 0;
		$scope.editInput = function(inputIndex, sectionIndex){
			
			editInputIndex = inputIndex;
			editSectionIndex = sectionIndex;
			$scope.editInputModel = angular.copy($scope.template.sections[sectionIndex].formElements[inputIndex]);
			
			console.log('Editing input ::: ',$scope.editInputModel);
			$('#editInputPropertiesModal').modal('show');

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

		$scope.saveInputProperties = function(){
			
			$scope.template.sections[editSectionIndex].formElements[editInputIndex] = angular.copy($scope.editInputModel);
			console.log('Edit Model ::: ',$scope.editInputModel);
			$('#editInputPropertiesModal').modal('hide');			
			changeDisplayLayout();
		};

		var convertArr = function(formElementArr, n) {
			var counter = 0;
			var length = formElementArr.length/n;
			var newArr = [];
			for(var i = 0; i < length; i++) {
				newArr[i] = [];
				for(var j = 0; j < n; j++) {
					if(formElementArr[ counter ] != undefined) {
						newArr[i].push(formElementArr[counter++]);
					}						
				}
			}
			console.log('Modified array',newArr);
			return newArr;
		};

		var changeDisplayLayout = function() {
			$scope.preview = angular.copy($scope.template);
			

			angular.forEach($scope.preview.sections, function(section, index){
				if(section.viewMode == '102') {
					section.formElements = convertArr(angular.copy(section.formElements), 2);
				} else if(section.viewMode == '103') {
					section.formElements = convertArr(angular.copy(section.formElements), 3);
				} else if(section.viewMode == '104') {
					section.formElements = convertArr(angular.copy(section.formElements), 4);
				} 

			});
		};

		$scope.changeDisplayLayoutOfSection = function(sectionIndex) {
			$scope.preview = angular.copy($scope.template);
			if($scope.preview.sections[sectionIndex].viewMode == '102') {
				$scope.preview.sections[sectionIndex].formElements = convertArr(angular.copy($scope.preview.sections[sectionIndex].formElements), 2);
			} else if($scope.preview.sections[sectionIndex].viewMode == '103') {
				$scope.preview.sections[sectionIndex].formElements = convertArr(angular.copy($scope.preview.sections[sectionIndex].formElements), 3);
			} else if($scope.preview.sections[sectionIndex].viewMode == '104') {
				$scope.preview.sections[sectionIndex].formElements = convertArr(angular.copy($scope.preview.sections[sectionIndex].formElements), 4);
			} 
		};

		$scope.saveForm = function() {

			
			var data = angular.copy($scope.template);
			angular.forEach(data.sections, function(section, sectionIndex){
				section.backgroundColor = angular.copy($scope.preview.sections[sectionIndex].backgroundColor);
				section.heading.align   = angular.copy($scope.preview.sections[sectionIndex].heading.align);
				section.heading.text    = angular.copy($scope.preview.sections[sectionIndex].heading.text);
			});
			
			console.log('Data to be submitted ::: ', data);
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

	});

})();