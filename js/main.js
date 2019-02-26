function init() {
	
	openFB.init({appId: '466211257250990'}); //localstorage instead of sessionstore: // tokenStore: window.localStorage

	if(window.sessionStorage.fbAccessToken) {
		openFB.getLoginStatus(facebookData);
	} else {
		showPanel('.authenticate-panel',false);
	}
	
	$('.upload').on('click',function(){
		showPanel('.capture-panel','.footer-photo');
		$('.nav-item').removeClass('active');
		$('.nav-item.photo').addClass('active');
		captureImage();
	});
}

function facebookData(response) {
	console.log('facebook auth check: '+ response.status);
	
	if(response.status === 'connected') {
		openFB.api({path: '/me', 
			success: function(response){
				showPanel('.maps-panel','.footer-navigation');
				$('.username').text(response.name);
				$('.profile-picture').attr("src", "https://graph.facebook.com/" + response.id + "/picture?type=normal")
				console.log(response);
			}, 
			error: function(err){
				showPanel('.authenticate-panel',false);
				openFB.logout();
			}
		});
	} else {
		showPanel('.authenticate-panel',false);
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

function captureImage() {
	navigator.mediaDevices.getUserMedia({
		'audio': false,
		'video': true
	 }).then(function(mediaStream) {
		
		var video = document.querySelector('video');
		    video.srcObject = mediaStream;
		    video.onloadedmetadata = function(e) {
			video.play();
		};
		
		var track = mediaStream.getVideoTracks()[0];
		var imageCapture = new ImageCapture(track);
		
		$('.capture-button').on('click',function(imageCapture){
			imageCapture.takePhoto().then(blob => {
				console.log('Photo taken');
				// img is an <img> tag
				var video = $('#capture-stream').hide();
				const image = document.querySelector('#capture-image');
				image.src = URL.createObjectURL(blob);
				$('.capture-button').hide();
				$('#capture-image').show();
			})
		    .catch(err => console.error('takePhoto() failed: '));
		});
	  
	 });
}

function showPanel(panel,footer) {
	
	console.log('show panel: '+ panel +', and footer: '+ footer);
	
	if($('.panel-splash').is(':visible')) {
		$('.panel-splash-background').delay(700).fadeOut();
	}
	
	$('.panel').hide();
	$(panel).show();
	
	$('.footer').hide();
	if(footer) {
		$(footer).show();
	}
}