const EQM_LOGO = Object.freeze({
	EQML_ERROR: 0,
	EQML_WARNING: 1,
	EQML_INFO: 2
});

function show_quick_message(msg, type)
{
	// let logo = "";
	// if(type == EQM_LOGO.EQML_ERROR)
	// {
	// 	logo = "src/res/type-error.svg";
	// }
	// else if(type == EQM_LOGO.EQML_WARNING)
	// {
	// 	logo = "src/res/type-warning.svg";
	// }
	// else
	// {
	// 	logo = "src/res/type-info.svg";
	// }

	let el1 = $("#quick-msg");
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