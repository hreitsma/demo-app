var App = (function () {

	var navHistory = [],
	
		platform,
		
		storage = window.localStorage,
	
		panelBehavior = {
			authenticate: { header: false, footer: false, history: false },
			maps: { header: true, footer: 'footer-navigation', history: true },
			capture: { header: true, footer: 'footer-photo', history: true },
			library: { header: true, footer: 'footer-photo', history: true },
		};

	$('.upload').on('click',function(){
		showPanel('capture');
		$('.nav-item').removeClass('active');
		$('.nav-item.photo').addClass('active');
		captureImage();
	});
	
	var backBtn = document.getElementById('back-button');
	var facebookBtn = document.getElementById('facebook-btn');
	var googleBtn = document.getElementById('google-btn');

	backBtn.addEventListener("click", goBack);
	facebookBtn.addEventListener("click", facebookLogin);
	googleBtn.addEventListener("click", googleLogin);
	
	function init(params) {
		
		if (params.platform) {
            platform = params.platform;
        }
		
		// add eventlistener for backbutton after deviceready
		document.addEventListener("backbutton", goBack, false);
		
		// initialize facebook authentication
		openFB.init({appId: '466211257250990', tokenStore: window.localStorage});

		// validate authentication tokens
		if(storage.fbAccessToken) {
			openFB.getLoginStatus(facebookData);
		} else {
			showPanel('authenticate');
		}
	}
	
	function goBack() {
		
		console.log('go back');
		console.log(navHistory);
		
		if(navHistory.length > 1) {
			console.log('history > 1');
			var panel = navHistory.splice(-2)[0];
		} else if(platform == 'android' || platform == 'iphone') {
			console.log('exit app');
			navigator.app.exitApp();
		} else if(window.localStorage.fbAccessToken) {
			console.log('fb logout');
			openFB.logout();
		} else if(false /* check for google login */) {
			// google logout
		}
		
		showPanel(panel || 'authenticate');
		
		return false;
	}

	function facebookData(response) {
		console.log('facebook auth check: '+ response.status);
		
		if(response.status === 'connected') {
			openFB.api({path: '/me', 
				success: function(response){
					showPanel('maps');
					$('.username').text(response.name);
					$('.profile-picture').attr("src", "https://graph.facebook.com/" + response.id + "/picture?type=normal")
					console.log(response);
				}, 
				error: function(err){
					showPanel('authenticate');
					openFB.logout();
				}
			});
		} else {
			showPanel('authenticate');
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
	
	function googleLogin() {
		
	}

	function captureImage() {
		navigator.mediaDevices.getUserMedia({
			'audio': false,
			'video': { facingMode: "environment", correctOrientation: true, }
		 }).then(function(mediaStream) {
			
			var video = document.querySelector('video');
				video.srcObject = mediaStream;
				video.onloadedmetadata = function(e) {
				video.play();
			};
			
			$('.capture-button').on('click',function(mediastream){
				
				var track = mediaStream.getVideoTracks()[0];
				var imageCapture = new ImageCapture(track);
				
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

	function showPanel(panel) {
		
		console.log('show panel: '+ panel);
		var b = panelBehavior[panel];
		if(b.history) { navHistory.push(panel); }
		
		$('.footer').hide();
		if(b.footer) {
			$('.'+ b.footer).show();
		}
		
		$('.panel').hide();
		$('.'+ panel +'-panel').show();
		
		console.log(navHistory);
	}
	
	// The public API
    return {
        init: init,
        goBack: goBack,
    }
	
}());