var app = {

    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	
    initialize: function() {
        var self = this;
		this.store = new MemoryStore(function() {
			self.showAlert('Store Initialized', 'Info');
		});
		
		document.addEventListener("backbutton", function() {
			self.showAlert('Back button pressed!', 'Action');
		}, true);
		
		$('.back-button').on('click',function(){
			self.showAlert('Back button pressed!', 'Action');
		});
		
		plugin.google.maps.environment.setEnv({
		  'API_KEY_FOR_BROWSER_RELEASE': '(YOUR_API_KEY_IS_HERE)',
		  'API_KEY_FOR_BROWSER_DEBUG': ''
		});

		// Create a Google Maps native view under the map_canvas div.
		var map = plugin.google.maps.Map.getMap($('#map'));

        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

app.initialize();