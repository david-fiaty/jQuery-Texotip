/**
 * Texotip jQuery plugin
 *
 * @copyright Copyright 2017, David Fiaty
 * @license   MIT license
 * @link      https://www.davidfiaty.com
 * @version   v1.0
 */

(function($) {

	$.fn.texotip = function(options) {

		// Set default parameters
		var defaults = {
			language: "en_GB",
			jsonData: "data",
			caseSensitive: true,
			defaultRenderPattern: '<a href="#" class="tooltip">@text</a>',
			topSpacing: 2,
			boxOffsetH: 0,
			boxOffsetV: 25,
			boxMinWidth: 250,
			boxPadding: 20,
			boxClass: 'texotip-box',
			boxzIndex: 9999,
			textRenderPattern: null,
			boxWillShow: function (arrow, close) {
				$(this).show();
				arrow.show();
				close.show();
			},
			boxWillHide: function (arrow, close) {
				arrow.hide().remove();
				close.hide().remove();
				$(this).hide().remove();
			},
			theme: 'red-ocean',
			linkActive: false,
			linkTarget: '_blank',
			closeButton: true					
		};

		// Assign the default settings
		$.fn.texotip.settings = $.extend(defaults, options);
		
		// Create an empty json data container
		$.fn.texotip.settings.data = {};
				
		// Init the plugin
		return init(this);
	}
	
	function init(wrapper) {
	
		// Load theme css
		$('head').append('<link rel="stylesheet" href="themes/' + $.fn.texotip.settings.theme + '/texotip.css" type="text/css" />');

		// Load the data
		$(this).getData(wrapper);

		// Hide all opened boxes
		$(window).resize(function() {
			var targets = $('.' + $.fn.texotip.settings.boxClass + ', .texotip-arrow');
			targets.each (function() {
				if ($(this).is(":visible")) {
					$(this).hide();
				}
			});
		});

		// Return the wrapper
		return wrapper;
	};

	function isURL(str) {
		if (str.indexOf("http://") == 0 || str.indexOf("https://") == 0) {
			return true
		}
		
		return false;
    };

	$.fn.getItemHtml = function (item, rowid) {
		
		// Get the html model
		var inputHTML = ($.fn.texotip.settings.textRenderPattern) 
									? $.fn.texotip.settings.textRenderPattern
									: $.fn.texotip.settings.defaultRenderPattern;

		// Prepare the output
		var outputHTML = inputHTML.replace('@text', item.text);
		outputHTML = $(outputHTML).attr({
			'id' : 'texotip' + rowid, 
			'data-content' : item.content,
			'data-url' : item.url
		});
		
		// Return
		return outputHTML[0].outerHTML;
	};

	$.fn.getData = function (wrapper) {

		var $this = $(this);
		var jsonURI = $.fn.texotip.settings.jsonData + '/' + $.fn.texotip.settings.language + '.texotip.json' ;

		// JSON file with language
		if (isURL($.fn.texotip.settings.jsonData)) {
			jsonURI = $.fn.texotip.settings.jsonData;
		}
				
		// Ajax query
		$.ajax({
			type: "POST",
			url: jsonURI,
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			dataType: "json",
			success: function(data) {
											
				// For each data row, replace the text by HTML
				$this.prepareItemOutput(wrapper, data);
					
				// Run the tooltip function
				$this.runActionFunction(wrapper);
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr.responseText);
			}
		});	
	};

	$.fn.prepareItemOutput = function (wrapper , data) {
		var $this = $(this);

		return $.each(data, function(i) {
			var regexp = new RegExp(data[i].text, "g");
			var itemHTML = $this.getItemHtml(data[i], i);
			wrapper.html(wrapper.html().replace(regexp, itemHTML));
		});   
	}

	$.fn.runActionFunction = function (wrapper) {
	
		// Set the target tooltip trigger class
		var targ;
				
		// Get the target
		targ = wrapper.find('.' + $($.fn.texotip.settings.defaultRenderPattern).attr('class')); 
		
		//Add the behavior
		var stack = {};
		targ.each( function(i) {
			$(this).addHoverEffect();
		}); 
	}

	$.fn.addHoverEffect = function () {
	 
	 	// Size and position parameters
		var $w = $(window);
	 	var $this = $(this);
		var scrollWidth = (window.innerWidth-$(window).width());	
		
		// Dynamically added elements
		var box = $('<div class="' + $.fn.texotip.settings.boxClass + '"></div>');
		var arrow = $('<div class="texotip-arrow"></div>');
		var close = $('<div class="texotip-close"></div>');
			
		// Mouseover
		$this.on('mouseenter', function () {
	
			// If the box is already visible
			if (!box.is(":visible")) {

				// Close all potentially opened boxes
				$('.texotip-close').trigger('click');
			
				// Add elements to the dom
				$this.append(arrow);
				$this.append(box);
			
				// Hide the added elements
				box.hide();
				arrow.hide();
				close.hide();
			
				// Detect right edge and set box position
				var space = $this.offset().left + $.fn.texotip.settings.boxOffsetH + $.fn.texotip.settings.boxMinWidth;
				if (space > $w.innerWidth()) {
					box.css('right', $w.innerWidth() - space - $.fn.texotip.settings.boxPadding + scrollWidth + 'px');		
				}
				else {
					box.css('left', $.fn.texotip.settings.boxOffsetH + 'px');
				}
				box.css('min-width', $.fn.texotip.settings.boxMinWidth + 'px');
				box.css('padding', $.fn.texotip.settings.boxPadding + 'px');
				box.css('top', parseInt($(this).css('font-size')) + 9 + $.fn.texotip.settings.topSpacing + 'px');
				box.css('z-index', $.fn.texotip.settings.boxzIndex);
				// todo remove this integer 9
	
				// Add content to the box
				box.html($this.data('content'));
			
				// Arrow position
				arrow.css('left', $this.width()/2 + 'px');
				arrow.css('top', $this.height() + $.fn.texotip.settings.topSpacing + 'px');
			
				// Close button visibility
				box.append(close);
				if (!$.fn.texotip.settings.closeButton) close.css('visibility', 'hidden');

				// Show the added elements
				$.fn.texotip.settings.boxWillShow.call(box, arrow, close);
			
				// Close button 
				if ($.fn.texotip.settings.closeButton) {	
					box.find('.texotip-close').on('click', function () {
						$.fn.texotip.settings.boxWillHide.call(box, arrow, close);
					});
				}
			}
		});

		// Mouseleave
		if (!$.fn.texotip.settings.closeButton) {
			$this.on('mouseleave', function () {
				if (box.is(":visible")) {
						$.fn.texotip.settings.boxWillHide.call(box, arrow, close);
				}
			});
		}

		// Click, tap
		if ($.fn.texotip.settings.linkActive) {
			$this.on('click tap', function (e) {
				window.open($this.data('url'), $.fn.texotip.settings.linkTarget);
			});		
		}
	}
}(jQuery));
