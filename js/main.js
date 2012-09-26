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
					rail.css('visibility', 'visible');
					
					setTimeout(function()
					{
						centerRail();
					}, 800);					
				}

				if ($this.index() === 0)
					$this.addClass('active').show();
				
				centerRail();
				
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
		
		next.fadeIn(config.transition.duration, function()
		{
			$(this).addClass('active');
			centerRail();

			ap = setInterval(autoPlay, config.transition.frequency);
		});

		current.fadeOut(config.transition.duration, function()
		{
			$(this).removeClass('active');
		});
				
		var caption = $('#caption');
		var nextCap = caption.children().eq(next.index());
		nextCap.show();
		var h = nextCap.height();
		nextCap.hide();
		caption.animate({'height': h}, config.transition.duration)
		caption.children(':visible').fadeOut(config.transition.duration / 2);
		nextCap.fadeIn(config.transition.duration / 2);
	};

	var addThumbnails = function()
	{
		//config
		var thumbHeight = 40;
		var rowCount = 14;

		var galWidth = $('#gallery').width();
		var thumbs = $('<div />').attr('id', 'thumbnails');
		$('#gallery').after(thumbs);

		var thumbGap = (parseInt(thumbs.css('width')) - (thumbHeight * rowCount)) / (rowCount - 1);

		rail.children().each(function()
		{
			var center = function(img)
			{
				$(img).css('left', (thumbHeight - $(img).width()) / 2);
			};
			
			var img = $('<img />').attr('src', $(this).attr('src')).height(thumbHeight).one("load", function()
			{
				if($(this).width() == 0)
				{
					var $this = $(this);
					
					setTimeout(function()
					{
						center($this);
					}, 800);
				}
				else
					center($(this));
			})
			.each(function()
			{
				if (this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) === 6))
					jQuery(this).trigger("load");
			})
			.click(changeImage);
			
			var t = $('<div class="thumb" />').append(img).width(thumbHeight).height(thumbHeight);
			t.appendTo(thumbs);

			if (t.index() % rowCount !== rowCount - 1 || t.index() === 0)
				t.css('margin-right', thumbGap);
		});
	};

	var addCaption = function()
	{
		var caption = $('<div />').attr('id', 'caption');
		
		rail.children().each(function(i)
		{
			var cap = config.images.list[i].caption;
			var p = $('<p />').text(cap).appendTo(caption);
			
			if(i == 0)
				p.show();
		});		

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
			$('#thumbnails').children().first().find('img').click();
		else
			$('#thumbnails').children().eq(ind + 1).first().find('img').trigger('click');
	};

	loadXML();
	console.log(config);
	var ap = setInterval(autoPlay, config.transition.frequency);
});
