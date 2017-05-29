(function(){
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems',FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

//Declare Directive, DDO
function FoundItems(){
   
    var ddo = {
        templateUrl: 'foundItems.html',
        scope:{ 
            onRemove: '&',
            found: '<'
        },
        //Not sure needs own controller.  Can also register this on the angular.module
        controller: FoundItemsDirectiveController, 
        controllerAs: 'list',
        bindToController: true
    };
    return ddo;

}

function FoundItemsDirectiveController(){
    var list = this;
    list.found = [];
    list.message = "Nothing Found";
}


//Main Controller: NarrowItDownController

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.search = function(){
        MenuSearchService.getMatchedMenuItems(menu.searchTerm)
        .then(function(results){
            
            menu.found = results.foundItems;
          
            if (results.foundItems.length === 0){
                menu.message = 'Nothing Found';
            }else{
                menu.message = "";
            }
        });
    }
    menu.removeItem = function(index){
        menu.found.splice(index,1);
    }
}  //END: NarrowItDownController

//*http Service 
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems= function (searchTerm) {
      //console.log(searchTerm);
    
    return $http({ 
        method: 'GET', 
        url: (ApiBasePath + '/menu_items.json')
        })
      .then(function(response){
          var dish = response.data;
          
          var found = [];

          for (var i=0; i<dish.menu_items.length; i++){
              var item = dish.menu_items[i];
              if (searchTerm != null && searchTerm !=="" && item.description.toLowerCase().indexOf(searchTerm)!==-1){
                found.push(item);
                }
          }
          return {foundItems: found};
       })
      .catch(function(error){
         //onsole.log("smething Went Wrong!");
          return {foundItems: []};
      });
   } //end getMatchedMenuItems
} //end menuSearchService

})();
