( function () {
	angular.module('app', [])
	.controller('appController', function($scope, $window) {
		$scope.template = {};
		
		$scope.template.title = {};
		$scope.template.title.align = 'center';

		$scope.template.sections = [];

		$scope.section = {};
		$scope.section.heading = {};
		$scope.section.name = 'Section '+ ($scope.template.sections.length + 1 );
		$scope.section.heading.align = 'center';
		$scope.section.viewMode = "100";
		$scope.section.formElements = [];

		$scope.model = {};

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

		$scope.addSection = function() {
			$scope.template.sections.push(angular.copy($scope.section));
			$("#collapseTwo").collapse("hide");
			$("#collapseThree").collapse("show");
			$scope.model.selectedSection = ($scope.template.sections.length - 1) + '';
			$scope.section = {};
			$scope.section.heading = {};
			$scope.section.name = 'Section '+ ($scope.template.sections.length + 1 );
			$scope.section.heading.align = 'center';
			$scope.section.viewMode = "100";
			$scope.section.formElements = [];


		};

		$scope.createElement = function(elementType) {
			
			var el = angular.copy(elementType);
			el.displayOrder = ($scope.template.sections[$scope.model.selectedSection].formElements.length + 1) + '';
			
			$scope.template.sections[$scope.model.selectedSection].formElements.push(el);
			
			/*$scope.sortFormElements();

			console.log($scope.preview);

			console.log(document.getElementsByClassName("element-li"));*/
				
		};




	})
	.filter("typeOf", function() {
		return function(obj) {
			return typeof obj;
		}
	});

})();