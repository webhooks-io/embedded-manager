<<<<<<< HEAD
# Installation

If you are using a client library the process to embed the views is very straight forward.  The client library basically is providing a shortcut for the slightly longer manual method outlined below.

```
// Step 1: Consult the docs for the client library you are using to locate the function for getting the embedded view HTML.

	// For this can visit http://webhooks.io/docs/client-libraries

// Step 2: Build the options that you would like to pass to the embedded view html function.
var opts = {
	consumer_id: "",
	paths: ""
};

// Step 3: Call the function withing the library and passin the options.
var view_html = lib.getEmbeddedViewHtml(opts);

// Step 4: The library should return the actual HTML, so just write it to the output stream.
writeoutput(view_html);
```

## Without client library

```
// Step 1: Call our REST API to get a Client Token

	// Details on this API call can be found at http://webhooks.io/docs/api

// Step 2: The library should return the actual HTML, so just write it to the output stream.

 <!--// START: Webhooks Embedded -->
<div id="webhookcontent"></div>
<script type="text/javascript" src="http://embedded.dev.webhooks.io/js/embedded.js"></script>
<script type="text/javascript">
    var opts = {"account_id":"{ Your Account Id }",
                "application_id":"{ Your Application Id }",
                "bucket_key":"default",
                "element_id":"webhookcontent",
                "paths":"*",
                "consumer_id":"{ The unique id of the client account. }",
                "show_introduction": true,
                "introduction_url": "{ URL to the markdown text for the introduction. }"
            }; 
    wh.display({{ client_token }}, opts);
</script>
<!--// END: Webhooks Embedded -->
```
## Configuration Options
There are several options that you can pass into the embeddable view which will allow you to customize how the view operates.

* ```account_id``` (required) - Your webhooks.io account_id.  This is required however if the client library is being used this value will be handled for you.
* ```application_id``` (required) - The application_id that was assigned to this application when creating within webhooks.io.  This is required however if the client library is being used this value will be handled for you.
* ```consumer_id``` (required) - The unique id of the client account that you would like to pass over to webhooks.io.
* ```bucket_key``` - Each consumer (your client account) can have multiple segmented "buckets".  These buckets allow for application providers to segment their different enviornments.
* ```element_id``` - The id of the element in the DOM where the content should appear.
* ```default_tab``` - The tab the interface should load on initial load, valid options include ```introduction```, ```dashboard```, ```destinations```, ```logs```.  Defaults to ```introduction```.
* ```show_introduction``` - If the introduction tab should show or not. Valid options include ```always```, ```never```, and ```no-destinations```.  Defaults to ```no-destinations``` which will only show the tag when the user has not added any destinations.
* ```introduction_url``` - If the introduction tab is set to show, this is the URL for the markdown content that will be displayed.


# Customization
You are free to fork this repository and customize as you wish.  If you would like to submit any customizations for inclusion into the code please send a pull request.
