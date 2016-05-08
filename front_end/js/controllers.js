angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $ionicLoading, Chats) {

  $scope.data = { contacts: [], search: '', receiver: null, message: '' };

  var isLoading = false;

  // indexed cache
  var resultCache = {};

  // will host the current key
  // to avoid tail requests
  var currentKeyword = null;

  $scope.search = function(filter) {
    console.log('trying to do some search with', filter);
    // trigger the action after 100ms delay
    // max of 10 request per second
    $timeout(
      function() {
        keywordSearch(filter)
      }, 
      100
    );
    

  };

  $scope.cancelSearch = function() {
    // init search state
    $scope.data = { contacts: [], search: '', receiver: null, message: $scope.data.message };

  };

  function keywordSearch(filter) {

    console.log(resultCache);

    var query = angular.copy(filter);

    currentKeyword = query;
    
    var inCache = typeof resultCache[query] !== "undefined";

    if(!inCache) {

      Chats.search(query).then(
      function(success) {

        // save data into cache first
        resultCache[query] = success;

        if(query === currentKeyword) {
          $scope.data.contacts = resultCache[query];
        }
        
      });

    } else {

      if(query === currentKeyword) {
        $scope.data.contacts = resultCache[currentKeyword];
      }
    }

  }


  $scope.setReceiver = function(object) {
    $scope.data.receiver = object;
  };

  $scope.send = function() {

    

    if($scope.data.receiver === null || $scope.data.message === '') {
      
      console.log("Should provide sufficient information !");
    } else {

      showMessage("Sending the message to: " + $scope.data.receiver.first_name, true);

      isLoading = true;

      io.socket.post("http://localhost:1337/chat/send", 
        { 
          from: 1, 
          to: $scope.data.receiver.id, 
          message: $scope.data.message 
        }, function(){
          // reset the state !
          $scope.data = { contacts: [], search: '', receiver: null, message: '' };

          isLoading = false;

          showMessage("Message successfully sent");
        });
    }

  };

  function showMessage(message) {
    // check there is a worker
    if(!isLoading) {

      $ionicLoading.hide();

      $ionicLoading.show({
        template: message
      });
      $timeout(function(){
        $ionicLoading.hide();
      }, 
      // 1,2 sec for me is the best
      // with this delay the end user
      // can in less read the full message info
      1200);
    }
    

  }

})

.controller('ChatsCtrl', function($scope, Chats) {

  

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  Chats.all().then(function(chats){
    $scope.chats = chats;
  });

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

  $scope.chat = Chats.get($stateParams.chatId);

  $scope.send = function send() {
    console.log("feedback");
    io.socket.post('http://localhost:1337/chat/send', { message: "Time: "+new Date()+" !", from: "Soufiane ELBAZ"});
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
