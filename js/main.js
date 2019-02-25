var facebookAuthenticated = 'checking';
var googleAuthenticated = false; // change to 'checking' when google auth is implemented

function init() {
	openFB.init({appId: '466211257250990'}); //localstorage instead of sessionstore: // tokenStore: window.localStorage

	openFB.getLoginStatus(facebookData);
}

function facebookData(response) {
	console.log('facebook auth check: '+ response.status);
	
	if(response.status === 'connected') {
		openFB.api({path: '/me', 
			success: function(response){
				facebookAuthenticated = true;
				$('.username').text(response.name);
				$('.profile-picture').attr("src", "https://graph.facebook.com/" + response.id + "/picture?type=normal")
				console.log(response);
			}, 
			error: function(err){
				facebookAuthenticated = false;
				openFB.logout();
			}
		});
	} else {
		facebookAuthenticated = false;
	}
	
	if(!facebookAuthenticated && !googleAuthenticated) {
		showPanel('.authenticate-panel',false);
	} else {
		showPanel('.maps-panel','.footer-navigation');
	}
}

function facebookLogin() {
	openFB.login( function(response) {
			if(response.status === 'connected') {
				openFB.getLoginStatus(facebookData);
				
				console.log('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
			} else {
				alert('Facebook login failed: ' + response.error);
			}
		}, {scope: 'public_profile,email'});
}

function showPanel(panel,footer) {
	$('.panel').hide();
	$(panel).show();
	
	$('.footer').hide();
	if(footer) {
		$(footer).show();
	}
}