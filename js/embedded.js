var origin = 'https://embedded.webhooks.io';
window.wh = {
	buildOpts: function(token, opts) {
        var frmParams = ["width","height","src","token","element_id"];

		if (typeof (opts.width) == 'undefined' || typeof (opts.width) != 'number' ) {
            opts.width = 500;
        }
        if (typeof (opts.height) == 'undefined' || typeof (opts.height) != 'number' ) {
            opts.height = 500;
        }
        if (typeof (opts.src) == 'undefined' || typeof (opts.src) != 'string' ) {
            opts.src = origin + '/';
        }
        if (typeof (token) == 'undefined' || typeof (token) != 'string' ) {
            token = '';
        }

        opts.src += '?token=' + token;

        for(var key in opts) {
            if(frmParams.indexOf(key) == -1) {
                opts.src += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(opts[key]);
            }
        }

        
        //opts.token = token;
        return opts;
	},
	display: function(token, opts) {
		var params = this.buildOpts(token, opts);




		var frm = document.createElement('iframe');
		frm.id = 'webhooksio-embedded';
		frm.setAttribute('src',params.src);
        //frm.setAttribute('src','');
        frm.frameBorder = 0;
        frm.marginWidth = 0;
        frm.marginHeight = 0;
        frm.scrolling = 'no';
		//frm.style.height = params.height + 'px';
        frm.style.width = '100%';
		document.getElementById(params.element_id).appendChild(frm);
       // Create browser compatible event handler.
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen for a message from the iframe.
        eventer(messageEvent, function(e) {
        if (e.origin !== origin || isNaN(e.data)) return;
            document.getElementById(frm.id).style.height = e.data + 'px';
        }, false);
	}

};


