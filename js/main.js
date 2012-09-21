/*
 * @author: Adam Cox
 * @email: adamdama@hotmail.com
 */
$(document).ready(function()
{
	var imageFolder = 'images/portfolio';
	var imageSrc = ['beached-book-cover-detail.jpg', 'behave-yourself-design-branding.jpg', 'behold-blue-college-piece.jpg', 'belated-god-logo.jpg', 'dbu-online-brochure-spread.jpg', 'fierce-pretty-things-college-project.jpg', 'flight-poster-design.jpg', 'giraffe-magazine-spread.jpg', 'horse-college-project.jpg', 'ioti-print-brochure.jpg', 'i-studentglobal-website-design.jpg', 'life-website-web-design-branding.jpg', 'sussexpeopledevelopment-branding-and-website.jpg', 'w-typography.jpg'];
	
	var rail = $('#rail');
	var railWidth = 0;
	var railHeight = 0;

	var init = function()
	{
		$(imageSrc).each(function()
		{
			$('<img />').attr('src', imageFolder + '/' + this.toString()).appendTo(rail).one("load", function()
			{
				var $this = $(this);

				$this.data('xPos', railWidth);

				railWidth += $this.outerWidth(true);
				rail.width(railWidth);

				if ($this.height() > railHeight)
					rail.height(railHeight = $this.height());

				if ($this.index() === rail.children().length - 1)
					centerRail();

				if ($this.index() === 0)
					$this.addClass('active').show();

				return false;
			}).each(function()
			{
				if (this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) === 6))
					jQuery(this).trigger("load");
			});
		});

		$(window).resize(centerRail);
	};

	var centerRail = function()
	{
		var image = rail.children().filter(function(index)
		{
			return $(this).is(':visible');
		}).first();

		var xPos = ($(window).width() - image.width()) / 2;

		rail.css('left', xPos + 'px');
	};
	
	var changeImage = function(e)
	{
		var src = $(this).attr('src');
		var current = rail.children('.active');
		var next = rail.children('img[src="'+src+'"]');
		
		var dir = next.index() > current.index() ? -1 : next.index() < current.index() ? 1 : 0;
		
		if(dir === 0)
			return;
		
		if(dir > 0)
			rail.css('left', parseInt(rail.css('left')) - next.width());			
		
		var left = parseInt(rail.css('left')) + (next.width() * dir);			
		rail.animate({left: left+'px'}, 600);
		
		current.fadeOut(600, function()
		{
			$(this).removeClass('active');
		});
		next.fadeIn(600, function()
		{
			$(this).addClass('active');
			centerRail();
		});
	};
	
	var addThumbnails = function()
	{
		//config
		var thumbWidth = 40;
		var rowCount = 14;
		
		var galWidth = $('#gallery').width();
		var thumbs = $('<div />').attr('id', 'thumbnails').css('margin', 'auto');		
		$('#gallery').after(thumbs);
		
		var thumbGap = (parseInt(thumbs.css('width')) - (thumbWidth * rowCount)) / (rowCount - 1);
		
		rail.children().each(function()
		{
			var t = $('<img />').attr('src', $(this).attr('src')).width(thumbWidth).height(thumbWidth);
			t.click(changeImage).appendTo(thumbs);
			
			if(t.index() % rowCount !== rowCount - 1 || t.index() === 0)
				t.css('margin-right', thumbGap);				
		});
	};
	
	var addCaption = function()
	{
		var caption = $('<div />').attr('id', 'caption').html($('<p />').text('untitled 1'));
		
		$('#gallery').after(caption);
	};
	
	init();
	addThumbnails();
	addCaption();
}); 