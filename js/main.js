/*
 * @author: Adam Cox
 * @email: adamdama@hotmail.com
 */
$(document).ready(function()
{
	var imageFolder = 'images/portfolio';
	var images = ['beached-book-cover-detail.jpg', 'behave-yourself-design-branding.jpg', 'behold-blue-college-piece.jpg', 'belated-god-logo.jpg', 'dbu-online-brochure-spread.jpg', 'fierce-pretty-things-college-project.jpg', 'flight-poster-design.jpg', 'giraffe-magazine-spread.jpg', 'horse-college-project.jpg', 'ioti-print-brochure.jpg', 'i-studentglobal-website-design.jpg', 'life-website-web-design-branding.jpg', 'sussexpeopledevelopment-branding-and-website.jpg', 'w-typography.jpg'];
	
	var thumbnails = [];
	
	var rail = $('#rail');
	var railWidth = 0;
	var railHeight = 0;

	var init = function()
	{
		$(images).each(function()
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
					$this.show();
					
				

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

	init();
}); 