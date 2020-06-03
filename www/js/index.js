
var app = {
  // Application Constructor.
  initialize: function() {
      document.addEventListener( 'deviceready', this.onDeviceReady.bind( this ), false );
  },

  // deviceready Event Handler.
  onDeviceReady: function() {
      this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event.
  receivedEvent: function(id) {

    var self = this;

    console.log('Here');

    $( '#register-form' ).on( 'submit', function( event ) {

        event.preventDefault();

        var data = {
            name : $( '#register-name' ).val(),
            email : $( '#register-email' ).val(),
            password : $( '#register-password' ).val()
        }

        $.post( 'http://localhost:8080/foodApp/webresources/users', function( response, status, xhr ) {
          console.log( response );
          console.log( status );
          console.log( xhr );
        })

        var url = 'http://localhost:8080/foodApp/webresources/users';
        self.getJSON( url,
            function(err, data) {
                if (err !== null) {
                  alert('Something went wrong: ' + err);
                } else {
                  console.log(data);
                }
            }
            
        );

    });

  },

  getJSON: function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
},
};

//http://localhost:8080/foodApp/webapi/users

app.initialize();