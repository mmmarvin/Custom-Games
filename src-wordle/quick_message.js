function show_quick_message(msg)
{
	let el1 = $("#quick-msg-bg");
	let el2 = $("#quick-msg-modal");
	
	el1.show();
	el2.html(`${msg}`);
	el2.show();

	el2.addClass("quick-msg-anim-hide");
	el2.on("animationend", () =>
	{
		el2.removeClass("quick-msg-anim-hide");
		el1.hide();
		el2.hide();
	});	
}