//handle all the events that happen in the chat room

//injecting two new services, moment and $ionicScrollDelegate

//moment allows us to use the moment.js library to get the cu rrent timestamp when a message is sent

//$ionicScrollDelegate automatically scrolls the app every time a new message is pushed into the array.
// This way the user always sees the most recent message.

(function(){
    angular.module('starter')
    .controller('RoomController', ['$scope', '$state', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', RoomController]);

    function RoomController($scope, $state, localStorageService, SocketService, moment, $ionicScrollDelegate){

        var me = this;

        me.messages = [];	//array which stores the messages sent in the current room

        $scope.humanize = function(timestamp){
            return moment(timestamp).fromNow(); //friendly time view
        };

        me.current_room = localStorageService.get('room');  //name of the current room from local storage and assign it to the controller

        var current_user = localStorageService.get('username');  //Get the name of the current user from the local storage.

        $scope.isNotCurrentUser = function(user){

            if(current_user != user){
                return 'not-current-user';
            }
            return 'current-user';
        };


        $scope.sendTextMessage = function(){

            var msg = {
                'room': me.current_room,
                'user': current_user,
                'text': me.message,
                'time': moment()
            };

            me.messages.push(msg);
            $ionicScrollDelegate.scrollBottom();

            me.message = '';

            SocketService.emit('send:message', msg);
        };


        $scope.leaveRoom = function(){
            var msg = {
                'user': current_user,
                'room': me.current_room,
                'time': moment()
            };

            SocketService.emit('leave:room', msg);
            $state.go('rooms');

        };


        SocketService.on('message', function(msg){
            me.messages.push(msg);
            $ionicScrollDelegate.scrollBottom();
        });


    }

})();