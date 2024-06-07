var __base1_current_mouse_pos = { x: -1, y: -1 };
$(document).mousemove((event) => {
    __base1_current_mouse_pos.x = event.pageX;
    __base1_current_mouse_pos.y = event.pageY;
});

function __base1_show_modal_impl(modal, closeable, width, height, func)
{
	if(modal && modal.parent().hasClass("modal-bg"))
	{
		let modal_parent = modal.parent();
		if(func)
		{
			modal.children(".modal-content").each((_, obj) =>
			{
				func($(obj));
			});
		}

		modal.children(".modal-title").each((_, obj) =>
		{
			$(obj).children('.modal-close').each((_, obj) =>
			{
				if(closeable)
				{
					$(obj).on("click", () =>
					{
						modal_parent.hide();
						modal.fadeOut(400, () =>
						{
							modal.trigger("hide");
						});
					});
				}
				else
				{
					$(obj).hide();
				}
			});
		});

		if(width)
		{
			modal.css("max-width", `${width}px`);
		}
		if(height)
		{
			modal.css("max-height", `${height}px`);
		}

		modal_parent.show();
		modal.fadeIn(400, () =>
		{
			modal.trigger("show");
		});
	}
}

function __base1_show_modal_url(modal, url, closeable, width, height)
{
	__base1_show_modal_impl(modal, closeable, width, height, (el) =>
	{
		el.load(url);
	});
}

function __base1_show_modal_html(modal, html, closeable, width, height)
{
	__base1_show_modal_impl(modal, closeable, width, height, (el) =>
	{
		el.html(html);
	});
}

function __base1_show_modal(modal, closeable, width, height)
{
	__base1_show_modal_impl(modal, closeable, width, height);
}

function __base1_register_show_modal(caller, modal, url, closeable, width, height)
{
	caller.on("click", () =>
	{
		__base1_show_modal_url(modal, url, closeable, width, height);
	});
}

function __base1_register_show_fly_nav(caller, fly_nav, url)
{
	if(fly_nav.parent())
	{
		let fly_nav_parent = fly_nav.parent();
		caller.on("click", () =>
		{
			if(url)
			{
				fly_nav.load(url);
			}

			fly_nav_parent.fadeIn(400);
			fly_nav.addClass("fly-nav-anim-enter");
			fly_nav.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (event) =>
			{
				if(event.originalEvent.animationName == "anim-nav-enter")
				{
					fly_nav.removeClass("fly-nav-anim-enter");
					fly_nav_parent.one("click", () =>
					{
						fly_nav_parent.fadeOut(400, () =>
						{
							fly_nav.removeClass("fly-nav-anim-exit");
						});
						fly_nav.addClass("fly-nav-anim-exit");
					});
				}
				else if(event.originalEvent.animationName == "anim-nav-exit")
				{
					fly_nav.removeClass("fly-nav-anim-exit");
				}
			});
		});
	}
}

function __base1_main()
{
	$(".button-image").each((_, obj) =>
	{
		let el = $(obj);
		el.css("background-image", `url('${el.data("src")}')`);
		
		if(el.data("width"))
		{
			el.css("max-width", `${el.data("width")}px`);
		}
		if(el.data("height"))
		{
			el.css("max-height", `${el.data("height")}px`);	
		}
		
		if(el.data("hover"))
		{
			el.hover(() => {
				el.css("background-image", `url('${el.data("hover")}')`);
			}, () => {
				el.css("background-image", `url('${el.data("src")}')`);
			});
		}
		if(el.data("down"))
		{
			el.on("mousedown", () =>
			{
				el.css("background-image", `url('${el.data("down")}')`);
			});
			el.on("mouseup", () =>
			{
				if(el.data("hover"))
				{
					if((__base1_current_mouse_pos.y >= el.position().top && __base1_current_mouse_pos.y <= el.position().top + el.innerHeight()) ||
					   (__base1_current_mouse_pos.x >= el.position().left && __base1_current_mouse_pos.x <= el.position().left + el.innerWidth()))
					{
						el.css("background-image", `url('${el.data("hover")}')`);
						return;
					}
				}

				el.css("background-image", `url('${el.data("src")}')`);
			});
		}
	});

	const color_scheme = ["white", "blue", "green", "purple", "orange", "gray"]
	for(const color of color_scheme)
	{
		const modal_func = (_, obj) =>
		{
			let el = $(obj);
			let dmid = el.data("modal");
			if(dmid && $(`#${dmid}`))
			{
				__base1_register_show_modal(el, 
											$(`#${dmid}`), 
											el.data("modal-content-url"), 
											el.data("modal-closeable"),
											el.data("modal-width"),
											el.data("modal-height"));
			}
		};

		const nav_func = (_, obj) =>
		{
			let el = $(obj);
			let dfid = el.data("nav");
			if(dfid && $(`#${el.data("nav")}`))
			{
				__base1_register_show_fly_nav(el, $(`#${el.data("nav")}`), el.data("nav-url"));
			}
		};

		const func = (_, obj) =>
		{
			modal_func(_, obj);
			nav_func(_, obj);
		};

		$(`.button-${color}-large`).each(func);
		$(`.button-${color}-large-ns`).each(func);
		$(`.button-${color}-small`).each(func);
		$(`.button-${color}-small-ns`).each(func);
	}

	$(".modal-close").each((_, obj) =>
	{
		$(obj).html("x");
	});
	
	$(".modal-bg").each((_, obj) =>
	{
		$(obj).hide();
	});

	$(".fly-nav-bg").each((_, obj) => {
		$(obj).hide();
	});
}

function __base1_copy_to_clipboard(str)
{
	// copy to clipboard is from
	// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard
	var $temp = $("<textarea></textarea>");
	
    $("body").append($temp);
    $temp.val(str).select();
    document.execCommand("copy");
    $temp.remove();
}

$(window).on("load", __base1_main());