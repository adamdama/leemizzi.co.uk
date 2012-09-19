/*
 * @author: Adam Cox
 * @email: adamdama@hotmail.com
 */
var imageFolder = 'images';
var images = ['beached-book-cover-detail.jpg', 'behave-yourself-design-branding.jpg', 'behold-blue-college-piece.jpg', 'belated-god-logo.jpg', 'dbu-online-brochure-spread.jpg', 'fierce-pretty-things-college-project.jpg', 'flight-poster-design.jpg', 'giraffe-magazine-spread.jpg', 'horse-college-project.jpg', 'ioti-print-brochure.jpg', 'i-studentglobal-website-design.jpg', 'life-website-web-design-branding.jpg', 'me.jpg', 'sussexpeopledevelopment-branding-and-website.jpg', 'w-typography.jpg'];

$(images).each(function()
{
	$('<img />').attr('src', imageFolder + '/' +this.toString()).appendTo('#gallery');
});

