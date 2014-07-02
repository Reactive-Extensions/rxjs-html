RxJS-DOM <sup>3.0</sup> - HTML DOM Bindings for the Reactive Extensions for JavaScript 
==========================================================
## OVERVIEW

This project provides Reactive Extensions for JavaScript (RxJS) bindings for HTML DOM objects to abstract over the event binding and Ajax requests.  The RxJS libraries are not included with this release and must be installed separately.

## GETTING STARTED

There are a number of ways to get started with the HTML DOM Bindings for RxJS.  The files are available on [cdnjs](http://cdnjs.com/) and [jsDelivr](http://www.jsdelivr.com/#!rxjs-dom).

### Download the Source

To download the source of the HTML DOM Bindings for the Reactive Extensions for JavaScript, type in the following:

    git clone https://github.com/Reactive-Extensions/rxjs-dom.git
    cd ./rxjs-dom

### Installing with [NPM](https://npmjs.org/)

	npm install rx-dom

### Installing with [Bower](http://bower.io/)

	bower install rxjs-dom

### Installing with [Jam](http://jamjs.org/)
	
	jam install rx-dom

### Installing with [NuGet](http://nuget.org)

	PM> Install-Package RxJS-Bridges-HTML	

### Getting Started with the HTML DOM Bindings

Let's walk through a simple yet powerful example of the Reactive Extensions for JavaScript Bindings for HTML, autocomplete.  In this example, we will take user input from a textbox and trim and throttle the input so that we're not overloading the server with requests for suggestions.

We'll start out with a basic skeleton for our application with script references to RxJS Lite, RxJS Time-based methods, and the RxJS Bindings for HTML DOM, along with a textbox for input and a list for our results.

	<script type="text/javascript" src="rx.lite.js"></script>
	<script type="text/javascript" src="rx.time.js"></script>
	<script type="text/javascript" src="rx.dom.js"><script>
	<script type="text/javascript">
		
	</script>
	...
	<input id="textInput" type="text"></input>
	<ul id="results"></ul>
	...

The goal here is to take the input from our textbox and throttle it in a way that it doesn't overload the service with requests.  To do that, we'll get the reference to the textInput using the document.getElementById moethod, then bind to the 'keyup' event using the `Rx.Observable.fromEvent` method from base RxJS which then takes the DOM element event handler and transforms it into an RxJS Observable. 
```js
var textInput = document.getElementById('textInput');
var throttledInput = Rx.Observable.fromEvent(textInput, 'keyup');
```
Since we're only interested in the text, we'll use the `select` or `map` method to take the event object and return the target's value.  
```js
	.map( function (ev) {
		return ev.target.value;
	})
```
We're also not interested in query terms less than two letters, so we'll trim that user input by using the `where` or `filter` method returning whether the string length is appropriate.
```js
	.filter( function (text) {
		return text.length > 2;
	})
```
We also want to slow down the user input a little bit so that the external service won't be flooded with requests.  To do that, we'll use the `throttle` method with a timeout of 500 milliseconds, which will ignore your fast typing and only return a value after you have paused for that time span.  
```js
	.throttle(500)
```
Lastly, we only want distinct values in our input stream, so we can ignore requests that are not unique, for example if I copy and paste the same value twice, the request will be ignored using the `distinctUntilChanged` method.
```js
	.distinctUntilChanged();
```
Putting it all together, our throttledInput looks like the following:

```js
var textInput = document.getElementById('textInput');
var throttledInput = Rx.Observable.fromEvent(textInput, 'keyup')
	.map( function (ev) {
		return textInput.value;
	})
	.filter( function (text) {
		return text.length > 2;
	})
	.throttle(500)
	.distinctUntilChanged();
```

Now that we have the throttled input from the textbox, we need to query our service, in this case, the Wikipedia API, for suggestions based upon our input.  To do this, we'll create a function called searchWikipedia which calls the `Rx.DOM.Request.jsonpRequest` method which wraps making a JSONP call.

```js
function searchWikipedia(term) {
  var cleanTerm = global.encodeURIComponent(term);
  var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
    + cleanTerm + '&callback=JSONPCallback';
  return Rx.DOM.Request.jsonpRequest(url);
}
```

Now that the Wikipedia Search has been wrapped, we can tie together throttled input and our service call.  In this case, we will call select on the throttledInput to then take the text from our textInput and then use it to query Wikipedia, filtering out empty records.  Finally, to deal with concurrency issues, we'll need to ensure we're getting only the latest value.  Issues can arise with asynchronous programming where an earlier value, if not cancelled properly, can be returned before the latest value is returned, thus causing bugs.  To ensure that this doesn't happen, we have the `flatMapLatest` method which returns only the latest value.

```js
var suggestions = throttledInput.flatMapLatest( function (text) {
	return searchWikipedia(text);
});
```

Finally, we'll subscribe to our observable by calling subscribe which will receive the results and put them into an unordered list.  We'll also handle errors, for example if the server is unavailable by passing in a second function which handles the errors.

```js
var resultList = document.getElementById('results');

function clearSelector (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createLineItem(text) {
	var li = document.createElement('li');
	li.innerHTML = text;
	return li;
}

suggestions.subscribe( function (data) {
  var results = data[1];

  clearSelector(resultList);

  for (var i = 0; i < results.length; i++) {
    resultList.appendChild(createLineItem(results[i]));
  }
}, function (e) {
	clearSelector(resultList);
    resultList.appendChild(createLineItem('Error: ' + e));
});

```

We've only scratched the surface of this library in this simple example.

##  API Documentation ##

You can find the documentation [here](https://github.com/Reactive-Extensions/RxJS-DOM/tree/master/doc) as well as examples [here](https://github.com/Reactive-Extensions/RxJS-DOM/tree/master/examples).

## Contributing ##

There are lots of ways to [contribute](https://github.com/Reactive-Extensions/RxJS-DOM/wiki/Contributing) to the project, and we appreciate our [contributors](https://github.com/Reactive-Extensions/RxJS-DOM/wiki/Contributors).

You can contribute by reviewing and sending feedback on code checkins, suggesting and trying out new features as they are implemented, submit bugs and help us verify fixes as they are checked in, as well as submit code fixes or code contributions of your own. Note that all code submissions will be rigorously reviewed and tested by the Rx Team, and only those that meet an extremely high bar for both quality and design/roadmap appropriateness will be merged into the source.

## LICENSE

Copyright 2013 Microsoft Open Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.