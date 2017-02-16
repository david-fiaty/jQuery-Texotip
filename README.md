[jQuery Texotip Plugin] - Multilingual tooltips based on JSON data files.
================================

The jQuery Texotip Plugin provides a tooltip system based on JSON data. 
Define words in a JSON file and specify what content should appear when a user interacts with those words.
jQuery supports plain text tooltips, but also HTML, video and audio content in the tooltips.

The plugin Texotip comes with default templates but you can easily customize the CSS.
jQuery Texotip supports multilanguage JSON data files, allowing you to display different content for different words, depending on the user language.

## Getting Started

### Downloading the files

jQuery Texotip can be downloaded on the top right corner of this page. Click on the button to clone or download the project on your desktop

### Including it on your page

Include jQuery and the plugin on a page.

```html
<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.0.min.js"></script>
<script type="text/javascript" src="texotip.js"></script>
```

### Prepare some text

Put the text you want to add your tooltips to in a wrapper.

```html
<div id="aText">
jQuery is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML. It is free, open-source software using the permissive MIT License. 
jQuery's syntax is designed to make it easier to navigate a document, select DOM elements, create animations, handle events, and develop Ajax applications. It also provides capabilities for developers to create plug-ins on top. This enables developers to create abstractions for low-level interaction and animation, advanced effects and high-level, themeable widgets. 
The modular approach to this library allows the creation of powerful dynamic web pages and Web applications.
</div>
```

### Call jQuery Texotip on the wrapper

```html
<script type="text/javascript">
$(document).ready( function() {
	$('#aText').texotip();	
});
</script>
```
There are a few parameters that you might want to add:

```html
<script type="text/javascript">
$(document).ready( function() {
	var texotip = $('#aText').texotip({
		language: "en_GB",
		jsonData: "data",
		caseSensitive: true,		    
		defaultRenderPattern: '<a href="#" class="tooltip">@text</a>'
	});	
});
</script>
```
**jsonData** can be a system path like path/to/file/en_GB.textotip.json or a web URL like http://mywebapi.com/en_GB.textotip.json
The plugin will try to guess depending on the format of what you put in that option.

### The JSON data

Prepare the JSON data for the target languages in a separate file. Here is an example for english in a language file named en_BG.texotip.json:

```html
[
	{
		"text": "jQuery",
		"content": "A simple image defined in the JSON data file<br><img src=\"http://www.logoeps.com/wp-content/uploads/2011/08/jquery-logo.jpg\">",
		"url": "http://www.google.co.uk"
	},
	{
		"text": "JavaScript library",
		"content": "A Youtube video about jQuery. Clicking on the link redirects to the Youtube page.<br><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/BWXggB-T1jQ\" frameborder=\"0\" allowfullscreen><\/iframe>",
		"url": "https://www.youtube.com/watch?v=BWXggB-T1jQ"
	},
	{
		"text": "DOM",
		"content": "<strong>What is the DOM?<\/strong><br>The Document Object Model (DOM) is a cross-platform and language-independent application programming interface that treats an HTML, XHTML, or XML document as a free structure wherein each node is an object representing a part of the document.",
		"url": "https://en.wikipedia.org/wiki/Document_Object_Model"
	},
	{
		"text": "widgets",
		"content": "This is an example of HTML audio widget display<br><audio controls><source src=\"horse.ogg\" type=\"audio/ogg\"></audio>",
		"url": "http://www.google.cn"
	}
]
```
Note that the HTML defined for the popups is escaped. The JSON file doesn't have to be static and could be generated dynamically by an API or a CMS.
From there, we can imagine displaying different tooltip contents for different users depending on various parameters like preferences, keywords or location.

### TODO
- Create more color themes
- Enrich the documentation (custom themes and animation callbacks)
- Add options to control the number of times a word can be highlighted

	
## License
Copyright &copy; David Fiaty<br>
Licensed under the MIT license.
