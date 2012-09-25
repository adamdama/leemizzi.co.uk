/*
 * @author: Adam Cox
 * @email: adamdama@hotmail.com
 */
$(document).ready(function()
{
	var config =
	{
		transition:
		{
			duration: 0,
			frequency: 0
		},
		images:
		{
			list: new Array(),
			folder: ''
		}
	};

	var rail = $('#rail');
	var railWidth = 0;
	var railHeight = 0;

	var init = function()
	{
		rail.css('visibility', 'hidden');

		$(imageSrc).each(function()
		{
			$('<img />').attr('src', imageFolder + '/' + this.toString()).appendTo(rail).one("load", function()
			{
				var $this = $(this);

				$this.data('xPos', railWidth);

				railWidth += $this.outerWidth(true);
				rail.width(railWidth);

				if ($this.height() > railHeight)
					rail.height( railHeight = $this.height());

				if ($this.index() === rail.children().length - 1)
				{
					centerRail();
					rail.css('visibility', 'visible');
				}

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
		var next = rail.children('img[src="' + src + '"]');

		var dir = next.index() > current.index() ? -1 : next.index() < current.index() ? 1 : 0;

		if (dir === 0)
			return;

		if (dir > 0)
			rail.css('left', parseInt(rail.css('left')) - next.width());

		var left = parseInt(rail.css('left')) + (next.width() * dir);
		rail.animate(
		{
			left: left + 'px'
		}, 600);

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
		var thumbs = $('<div />').attr('id', 'thumbnails');
		$('#gallery').after(thumbs);

		var thumbGap = (parseInt(thumbs.css('width')) - (thumbWidth * rowCount)) / (rowCount - 1);

		rail.children().each(function()
		{
			var t = $('<img />').attr('src', $(this).attr('src')).width(thumbWidth).height(thumbWidth);
			t.click(changeImage).appendTo(thumbs);

			if (t.index() % rowCount !== rowCount - 1 || t.index() === 0)
				t.css('margin-right', thumbGap);
		});
	};

	var addCaption = function()
	{
		var caption = $('<div />').attr('id', 'caption').html($('<p />').text('untitled 1'));

		$('#gallery').after(caption);
	};

	var loadXML = function()
	{
		$.ajax(
		{
			type: "GET",
			url: "config.xml",
			dataType: "xml",
			success: parseXml
		});
	};

	var parseXML = function(xml)
	{
		$(xml).find("config").each(function()
		{
			$("#output").append($(this).attr("author") + "<br />");
		});

		init();
		addThumbnails();
		addCaption();
	};

	loadXML();
});
