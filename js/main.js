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

		$(config.images.list).each(function(i)
		{
			$('<img />').attr('src', config.images.folder + this.src.toString()).appendTo(rail).one("load", function()
			{
				var $this = $(this);

				$this.data('xPos', railWidth);

				$this.show();
				railWidth += $this.outerWidth(true);
				$this.hide();
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
		clearInterval(ap);

		var src = $(this).attr('src');
		var current = rail.children('.active');
		var next = rail.children('img[src="' + src + '"]');

		var dir = next.index() > current.index() ? -1 : next.index() < current.index() ? 1 : 0;

		if (dir === 0)
		{
			ap = setInterval(autoPlay, config.transition.frequency);
			return;
		}

		if (dir > 0)
			rail.css('left', parseInt(rail.css('left')) - next.width());

		var left = parseInt(rail.css('left')) + (next.width() * dir);
		rail.animate(
		{
			left: left + 'px'
		}, config.transition.duration);

		current.fadeOut(config.transition.duration, function()
		{
			$(this).removeClass('active');
		});
		next.fadeIn(config.transition.duration, function()
		{
			$(this).addClass('active');
			centerRail();

			ap = setInterval(autoPlay, config.transition.frequency);
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
			url: "gallery.xml",
			dataType: "xml",
			success: parseXML
		});
	};

	var parseXML = function(xml)
	{
		var cf = $(xml).find('config');
		var imgs = $(xml).find('images');

		imgs.children().each(function()
		{
			var src = $(this).find('source').text();
			var cap = $(this).find('caption').text();

			var img =
			{
				src: src,
				caption: cap
			};

			config.images.list.push(img);
		});

		config.images.folder = cf.find('folder').text();
		config.transition.duration = parseInt(cf.find('transition').children('duration').text());
		config.transition.frequency = parseFloat(cf.find('transition').children('frequency').text()) * 1000;

		init();
		addThumbnails();
		addCaption();
	};

	var autoPlay = function()
	{
		var ind = rail.children(':visible').first().index();

		if (rail.children().length - 1 === ind)
			$('#thumbnails').children().first().click();
		else
			$('#thumbnails').children().eq(ind + 1).first().trigger('click');
	};

	loadXML();
	console.log(config);
	var ap = setInterval(autoPlay, config.transition.frequency);
});
