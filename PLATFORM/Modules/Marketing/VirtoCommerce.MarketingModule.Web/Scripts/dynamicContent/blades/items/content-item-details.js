﻿angular.module('virtoCommerce.marketingModule')
.controller('virtoCommerce.marketingModule.addContentItemsController', ['$scope', 'virtoCommerce.marketingModule.dynamicContent.contentItems', 'platformWebApp.bladeNavigationService', 'platformWebApp.dialogService', function ($scope, marketing_dynamicContents_res_contentItems, bladeNavigationService, dialogService) {
    $scope.setForm = function (form) {
        $scope.formScope = form;
    }

    var blade = $scope.blade;

    blade.initialize = function () {
        $scope.blade.toolbarCommands = [];

        if (!blade.isNew) {
            $scope.blade.toolbarCommands = [
				{
				    name: "Save", icon: 'fa fa-save',
				    executeMethod: function () {
				        blade.saveChanges();
				    },
				    canExecuteMethod: function () {
				        return !angular.equals(blade.originalEntity, blade.entity) && !$scope.formScope.$invalid;
				    },
				    permission: 'marketing:manage'
				},
                {
                    name: "Reset", icon: 'fa fa-undo',
                    executeMethod: function () {
                        blade.entity = angular.copy(blade.originalEntity);
                    },
                    canExecuteMethod: function () {
                        return !angular.equals(blade.originalEntity, blade.entity);
                    },
                    permission: 'marketing:manage'
                },
				{
				    name: "Delete", icon: 'fa fa-trash',
				    executeMethod: function () {
				    	var dialog = {
				    		id: "confirmDeleteContentItem",
				    		title: "Delete confirmation",
				    		message: "Are you sure want to delete content item?",
				    		callback: function (remove) {
				    			if (remove) {
				    				blade.delete();
				    			}
				    		}
				    	};

				    	dialogService.showConfirmationDialog(dialog);
				    },
				    canExecuteMethod: function () {
				        return true;
				    },
				    permission: 'marketing:manage'
				}
            ];
        }

        $scope.blade.toolbarCommands.push(
            {
                name: "Manage type properties", icon: 'fa fa-edit',
                executeMethod: function () {
            	    var newBlade = {
            		    id: 'dynamicPropertyList',
            		    objectType: blade.entity.objectType,
            		    controller: 'platformWebApp.dynamicPropertyListController',
            		    template: 'Scripts/app/dynamicProperties/blades/dynamicProperty-list.tpl.html'
            	    };
            	    bladeNavigationService.showBlade(newBlade, blade);
                },
                canExecuteMethod: function () {
            	    return angular.isDefined(blade.entity.objectType);
                }
            });

        blade.originalEntity = angular.copy(blade.entity);

        blade.isLoading = false;
    }

    blade.delete = function () {
        blade.isLoading = true;
        marketing_dynamicContents_res_contentItems.delete({ ids: [blade.entity.id] }, function () {
            blade.parentBlade.initializeBlade();
            bladeNavigationService.closeBlade(blade);
        },
        function (error) { bladeNavigationService.setError('Error ' + error.status, $scope.blade); blade.isLoading = false; });
    }

    blade.saveChanges = function () {
        blade.isLoading = true;

        if (blade.isNew) {
            marketing_dynamicContents_res_contentItems.save({}, blade.entity, function (data) {
            	blade.parentBlade.initializeBlade();
                bladeNavigationService.closeBlade(blade);
            },
            function (error) { bladeNavigationService.setError('Error ' + error.status, $scope.blade); blade.isLoading = false; });
        }
        else {
            marketing_dynamicContents_res_contentItems.update({}, blade.entity, function (data) {
            	blade.parentBlade.initializeBlade();
                blade.originalEntity = angular.copy(blade.entity);
                blade.isLoading = false;
            },
            function (error) { bladeNavigationService.setError('Error ' + error.status, $scope.blade); blade.isLoading = false; });
        }
    }

    $scope.blade.headIcon = 'fa-inbox';

    blade.initialize();
}]);