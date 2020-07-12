
var foodApp = {
    // Application Constructor.
    initialize: function() {
        document.addEventListener( 'deviceready', this.onDeviceReady.bind( this ), false );
    },

    // deviceready Event Handler.
    onDeviceReady: function() {
        this.receivedEvent( 'deviceready' );
    },

    // Update DOM on a Received Event.
    receivedEvent: function( id ) {

        if ( window.location.pathname != '/index.html' && window.location.pathname != '/' ) {
            foodApp.checkToken();

            if ( window.location.pathname == '/settings.html' ) {

                foodApp.settingsPage();

            } else if ( window.location.pathname == '/diary.html' ) {

                foodApp.diaryPage();

            }
        } else {
            if ( window.location.search != '' ) {
                var queryString = window.location.search.substr( 1 );
                var querys = queryString.split( '&' );

                querys.forEach( query => {
                    var queryParts = query.split( '=' );

                    if ( queryParts[0] == 'error_code' ) {
                        if ( queryParts[1] == 'session_expired' ) {
                            $( '.login-form__error--form').html( 'Your session has expired, please login again.' ).show();
                        }
                        if ( queryParts[1] == 'invalid_token' || queryParts[1] == 'unknown_error' ) {
                            $( '.login-form__error--form').html( 'There has been an error, please login again.' ).show();
                        }
                    } else if ( queryParts[0] == 'account_deleted' ) {
                        if ( queryParts[1] == 'true' ) {
                            $( '.login-form__error--form').html( 'Your account has been successfully deleted.' ).show();
                        }
                    }
                });

            }
        }

        $( '.login-form--switch' ).on( 'click', function( event ) {
            event.preventDefault();
            foodApp.switchLogin( this );
        });

        $( '#register-submit' ).on( 'click', function( event ) {
            event.preventDefault(); 
            foodApp.registerSubmit();           
        });

        $( '#login-submit' ).on( 'click', function( event ) {
            event.preventDefault();
            foodApp.loginSubmit();
        });
        
        
    },

    switchLogin : function( target ) {

        $( target ).parents( '.login-form' ).fadeOut( 'slow', 'swing', function() {
            $( this ).siblings( '.login-form' ).fadeIn( 'slow', 'swing' );
        });

    },

    registerSubmit: function() {

        $( '.login-form__error' ).html( '' ).hide();

        var data = {};
        var valid = true;
        var name = $( '#register-name' ).val();
        var email = $( '#register-email' ).val();
        var password = $( '#register-password' ).val();
        var passwordTest = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';
        var emailTest = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';

        if ( ! name ) {
            valid = false;
            $( '.login-form__error--name').html( 'Please enter your name' ).show();
        }

        if ( ! email ) {
            valid = false;
            $( '.login-form__error--email').html( 'Please enter an email address' ).show();
        } else if ( ! email.match( emailTest ) ) {
            valid = false;
            $( '.login-form__error--email').html( 'Please enter a valid email address' ).show();
        }

        if ( ! password ) {
            valid = false;
            $( '.login-form__error--password').html( 'Please enter a password' ).show();
        } else if ( password.length < 8 || ! password.match( passwordTest ) ) {
            valid = false;
            $( '.login-form__error--password').html( 'Please enter a stronger password' ).show();
        }

        if ( valid ) {
            data = {
                name : name,
                email : email,
                password : password,
            }
            foodApp.sendAjax( 'users', 'POST', foodApp.registerResponse, data );
        }
    },

    registerResponse: function( response ) {

        if ( response.userId ) {
            foodApp.loggedIn( response );
        } else if ( response.errorName == 'user_already_exists' ) {
            $( '.login-form__error--email').html( response.errorDetails ).show();
        } else if ( response.errorName == 'user_create_failed' ) {
            $( '.login-form__error--form').html( response.errorDetails ).show();
        } else if ( response.errorName == 'name_empty' ) {
            $( '.login-form__error--name').html( response.errorDetails ).show();
        } else if ( response.errorName == 'email_empty' ) {
            $( '.login-form__error--email').html( response.errorDetails ).show();
        } else if ( response.errorName == 'email_invalid' ) {
            $( '.login-form__error--email').html( response.errorDetails ).show();
        } else if ( response.errorName == 'password_empty' ) {
            $( '.login-form__error--password').html( response.errorDetails ).show();
        } else if ( response.errorName == 'password_invalid' ) {
            $( '.login-form__error--password').html( response.errorDetails ).show();
        } else {
            $( '.login-form__error--form').html( 'Something went wrong, please try again.' ).show();
        }
        
    },

    loginSubmit: function() {
        $( '.login-form__error' ).html( '' ).hide();

        var data = {};
        var valid = true;
        var email = $( '#login-email' ).val();
        var password = $( '#login-password' ).val();
        var emailTest = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';

        if ( ! email ) {
            valid = false;
            $( '.login-form__error--email' ).html( 'Please enter an email address' ).show();
        } else if ( ! email.match( emailTest ) ) {
            valid = false;
            $( '.login-form__error--email' ).html( 'Please enter a valid email address' ).show();
        }

        if ( ! password ) {
            valid = false;
            $( '.login-form__error--password' ).html( 'Please enter your password' ).show();
        }

        if ( valid ) {
            data = {
                email : email,
                password : password,
            }
            foodApp.sendAjax( 'users/login', 'POST', foodApp.loginResponse, data );
        }

    },

    loginResponse: function( response ) {

        if ( response.userId ) {
            foodApp.loggedIn( response );
        } else {
            $( '.login-form__error--form').html( 'Unable to log you in, please try again.' ).show();
        }
        
    },


    loggedIn: function( user ) {

        localStorage.setItem( 'userId', user.userId );
        localStorage.setItem( 'accessToken', user.accessToken );
        localStorage.setItem( 'tokenExpiry', user.tokenExpiry );
        localStorage.setItem( 'name', user.name );
        localStorage.setItem( 'email', user.email );

        window.location.href = window.location.origin + '/diary.html';

    },

    logOut: function() {

        localStorage.setItem( 'userId', '' );
        localStorage.setItem( 'accessToken', '' );
        localStorage.setItem( 'tokenExpiry', '' );

        window.location.href = window.location.origin;

    },

    checkToken: function() {

        if ( localStorage.getItem( 'userId' ) && localStorage.getItem( 'accessToken' ) && localStorage.getItem( 'tokenExpiry' ) ) {

            var data = {
                userId: localStorage.getItem( 'userId' ),
                accessToken: localStorage.getItem( 'accessToken' ),
                tokenExpiry: localStorage.getItem( 'tokenExpiry' ),
            }

            foodApp.sendAjax( 'users/checkToken', 'POST', foodApp.checkTokenResponse, data );
            
        } else {
            window.location.href = window.location.origin;

        }
    },

    checkTokenResponse: function( response ) {

        if ( response.errorName == 'invalid_token' || response.errorName == 'session_expired' ) {
            window.location.href = window.location.origin + '?error_code=' + response.errorName;
        } else if ( response.userId ) {
            localStorage.setItem( 'accessToken', response.accessToken );
            localStorage.setItem( 'tokenExpiry', response.tokenExpiry );
        } else {
            window.location.href = window.location.origin + '?error_code=unknown_error';
        }
    },

    deleteUser: function() {
        var data = {
            userId: localStorage.getItem( 'userId' ),
            accessToken: localStorage.getItem( 'accessToken' )
        }
        foodApp.sendAjax( 'users/delete', 'POST', foodApp.deleteUserResponse, data );
    },

    deleteUserResponse: function( response ) {
        
        if ( response.errorName == 'delete_success' ) {
            window.location.href = window.location.origin + '?account_deleted=true';
        } else {
            $( '#delete-reject' ).hide();
            $( '#delete-confirm' ).hide();
            $( '#delete-account' ).show();
            $( '.settings-form__error--form').html( response.errorDetails )
        }
    },

    updateUser: function( response ) {
        if ( response.errorName ) {
            $( '.settings-form__error--form' ).html( response.errorDetails ).show();
        
        } else  {
            $( '.settings-form__error--form' ).html( 'There was an error, please try again' ).show();
        }
        $( '#settings-buttons-wrapper' ).show();
        $( '#settings-current-password-wrapper' ).hide();
    },

    settingsPage: function() {

        $( '#settings-name' ).val( localStorage.getItem( 'name' ) );
        $( '#settings-email' ).val( localStorage.getItem( 'email' ) );
        
        $( '.settings-form__error--form' ).html( '' ).hide();
    
        $( '#logout' ).on( 'click', function( event ) {
            event.preventDefault();
            foodApp.logOut();
        });

        $( '#delete-account' ).on( 'click', function( event ) {
            event.preventDefault();
            $( this ).hide();
            $( '#delete-confirm' ).show();
            $( '#delete-reject' ).show();
            $( '.settings-form__error--form').html( 'Are you sure?' ).show();

            $( '#delete-reject' ).on( 'click', function( event ) {
                event.preventDefault();
                $( this ).hide();
                $( '#delete-confirm' ).hide();
                $( '#delete-account' ).show();
                $( '.settings-form__error--form').html( '' ).hide();
            });

            $( '#delete-confirm' ).on( 'click', function( event ) {
                event.preventDefault();
                foodApp.deleteUser();
            });

        });

        $( '#settings-save' ).on( 'click', function( event ) {
            event.preventDefault();

            $( '#settings-buttons-wrapper' ).hide();
            $( '#settings-current-password-wrapper' ).show();

        });

        $( '#settings-form' ).on( 'submit', function( event ) {

            event.preventDefault();

            foodApp.checkToken();

            $( '.settings-form__error' ).html( '' ).hide();

            var name = $( '#settings-name' ).val();
            var email = $( '#settings-email' ).val();
            var newPassword = $( '#settings-password' ).val();
            var currentPassword = $( '#settings-current-password' ).val();
            var valid = true;

            var data = {
                userId: localStorage.getItem( 'userId' ),
            }

            if ( ! currentPassword ) {
                valid = false;
                $( '.settings-form__error--current-password' ).html( 'Please enter your password' ).show();
            } else {
                data.password = currentPassword;
            }

            if ( name ) {
                data.name = name;
            } else {
                data.name = localStorage.getItem( 'name' );
            }

            if ( email ) {
                data.email = email;
            } else {
                data.email = localStorage.getItem( 'email' );
            }

            if ( newPassword ) {
                data.salt = newPassword;
            }

            if ( valid ) {
    
                foodApp.sendAjax( 'users', 'PUT', foodApp.updateUser, data );
                localStorage.setItem( 'name', name );
                localStorage.setItem( 'email', email );
            }


        });

    },

    diaryPage: function() {

        var date = null;
        var primary = new Date()
        var before = new Date();
        var after = new Date();
        var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        if ( window.location.search != '' ) {
            var queryString = window.location.search.substr( 1 );
            var querys = queryString.split( '&' );

            querys.forEach( query => {
                var queryParts = query.split( '=' );

                if ( queryParts[0] == 'diary_date' ) {
                    var dateParts = queryParts[1].split( '-' );
                    primary.setFullYear( dateParts[2], dateParts[1], dateParts[0] );
                }
            });

        }

        before.setDate( primary.getDate() - 1);
        after.setDate( primary.getDate() + 1);
        
        $( '.diary-header__date' ).html( primary.getDate() + ' ' + months[primary.getMonth()] );
        $( '.diary-day' ).data( 'date', primary.getDate() + '-' + primary.getMonth() + '-' + primary.getFullYear() );
        $( '.diary-button--before' ).html( before.getDate() + ' ' + months[before.getMonth()] ).data( 'date', before.getDate() + '-' + before.getMonth() + '-' + before.getFullYear() );
        $( '.diary-button--after' ).html( after.getDate() + ' ' + months[after.getMonth()] ).data( 'date', after.getDate() + '-' + after.getMonth() + '-' + after.getFullYear() );

        $( '.diary-button' ).on( 'click', function( event ) {
            event.preventDefault();
            window.location.href = window.location.origin + '/diary.html?diary_date=' + $( this ).data( 'date' );
        });
    },

    sendAjax: function( path, method, ajaxCallback, data = null ) {

        var ajaxSettings = {
            url: 'http://localhost:8080/foodApp/webresources/' + path + '/',
            method: method,
            dataType: 'json',
            contentType: 'application/json',
            success: function( response ) {
                ajaxCallback( response );
            },
            error: function( error ) {
                console.log( error );
            }
        }

        if ( data ) {
            ajaxSettings.data = JSON.stringify( data );
        }

        console.log( ajaxSettings );

        $.ajax( ajaxSettings );

    },

    
  
};

foodApp.initialize();