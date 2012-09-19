/*
 * @author: Adam Cox
 * @email: adamdama@hotmail.com
 */
$(document).ready(function()
{
	var imageFolder = 'images/portfolio';
	var images = ['beached-book-cover-detail.jpg', 'behave-yourself-design-branding.jpg', 'behold-blue-college-piece.jpg', 'belated-god-logo.jpg', 'dbu-online-brochure-spread.jpg', 'fierce-pretty-things-college-project.jpg', 'flight-poster-design.jpg', 'giraffe-magazine-spread.jpg', 'horse-college-project.jpg', 'ioti-print-brochure.jpg', 'i-studentglobal-website-design.jpg', 'life-website-web-design-branding.jpg', 'me.jpg', 'sussexpeopledevelopment-branding-and-website.jpg', 'w-typography.jpg'];

	var rail = $('#rail');
	var railWidth = 0;

	$(images).each(function()
	{
		$('<img />').attr('src', imageFolder + '/' + this.toString())
		.appendTo(rail)
		.one("load", function()
		{
			railWidth += $(this).width();
			rail.width(railWidth);

			return false;
		})
		.each(function()
		{
			if (this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6))
				jQuery(this).trigger("load");
		});
	});
});

