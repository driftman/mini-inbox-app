angular.module('starter.services', [])

.factory('Chats', function($http, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  

  function add(message) {
    io.socket.post("http://localhost:1337/chat/send", { from: 1, to: 2, message: "Hello father" });
  }


  function search(keyword) {
      var deferred = $q.defer();
      if(keyword === "") {
        deferred.resolve([]);
      } else {
        $http({ url: "http://localhost:1337/chat/getFriendsKeyword", data: { id: 1, keyword: "%"+keyword+"%" }, method: "POST" }).then(
          function(success){
            console.log(success)
            deferred.resolve(success.data);
          },
          function(error){
            console.log(error)
            deferred.reject(error);
          });
      }
      
      return deferred.promise;
  }

  return {
    all: function() {
      var deferred = $q.defer();
      $http.get("http://localhost:1337/chat").then(
        function(success){
          console.log(success);
          deferred.resolve(success.data);
        }, 
        function(error){
          console.log(error);
          deferred.reject(error);
        });
      return deferred.promise;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },

    search: search,
    add: add

  };
});
