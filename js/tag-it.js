(function($) {

	$.fn.tagit = function(options) {

		var el			= this,
			BACKSPACE	= 8,
			ENTER		= 13,
			SPACE		= 32,
			COMMA		= 44;
		
		options.name = options.name || $(el).attr('id')+'[]';
		// add select behaviour
		options.autocomplete.select = function(event,ui){
			if (is_new (ui.item.value)) {
				create_choice (ui.item.value);
			}
			// Cleaning the input.
			tag_input.val("");

			// Preventing the tag input to be update with the chosen value.
			return false;
		}

		// add the tagit CSS class.
		el.addClass("tagit");

		// get existing li elements
		var lis = [];
		
		el.children('li').each(function(){
			lis.push($(this).text());
		});

		// create the input field.
		var html_input_field = "<li class=\"tagit-new\"><input class=\"tagit-input\" type=\"text\" /></li>\n";
		el.html (html_input_field);
		
		var tag_input	= el.children(".tagit-new").children(".tagit-input");

		if(lis.length > 0)
		{
			for(i=0,value='';value=lis[i];i++){
				create_choice.call(this.tag_input,value);
			}
		}

		$(this).click(function(e){
			if (e.target.tagName == 'BUTTON') {
				// Removes a tag when clicked.
				// Event is binded to the UL, otherwise a new tag (LI > A) wouldn't have this event attached to it.
				e.preventDefault();
				$(e.target).parent().remove();
			}
			else {
				// Sets the focus() to the input field, if the user clicks anywhere inside the UL.
				// This is needed because the input field needs to be of a small size.
				tag_input.focus();
			}
		});

		tag_input.keypress(function(event){
			// Comma/Space/Enter are all valid delimiters for new tags.
			if (event.which == COMMA || event.which == SPACE || event.which == ENTER) {
				event.preventDefault();

				var typed = tag_input.val();
				typed = typed.replace(/,+$/,"");
				typed = $.trim(typed);

				if (typed != "") {
					if (is_new (typed)) {
						create_choice (typed);
					}
					// Cleaning the input.
					tag_input.val("");
				}

				tag_input.autocomplete('close');
			}
		});
		
		tag_input.keyup(function(event){
			if (event.which == BACKSPACE) {
				if (tag_input.val() == "") {
					// When backspace is pressed, the last tag is deleted.
					$(el).children(".tagit-choice:last").remove();
				}
			}
		});

		tag_input.autocomplete(options.autocomplete);

		function is_new (value){
			var is_new = true;
			tag_input.parents("ul").children(".tagit-choice").each(function(i){
				n = $(this).children("input").val();
				if (value == n) {
					is_new = false;
				}
			})
			return is_new;
		}

		function create_choice (value){
			var input = $('<input/>',{
			type: 'hidden',
			    	'value':value,
			    	name:options.name
			}),
			button = $('<button/>',{
				text: value	       
			}).button({
				icons: {
					secondary: 'ui-icon-minus'
				}	
			}),
			li = $('<li>',{
				class:'tagit-choice'
			}).append(input).append(button),
			li_search_tags = tag_input.parent();

			$(li).insertBefore (li_search_tags);
			tag_input.val("");
		}
	};

})(jQuery);
