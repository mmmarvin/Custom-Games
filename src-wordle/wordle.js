var game = null;
var try_ans = [];

function do_add_letter(letter)
{
	if(game._try_freeze.count() > 0 ||
	   game.game_over())
	{
		return;
	}

	letter = letter.toLowerCase();
	if(try_ans.length < cor_ans.length)
	{
		try_ans.push(letter);

		const r = game.attempt_number() + 1;
		const c = try_ans.length;
		const id = get_ans_box_id(r, c);
		let el = $(`#${id}`);
		
		el.removeClass("ans-box-empty");
		el.addClass("ans-box-filled");

		el.addClass("ans-box-filled-anim");
		el.html(letter.toUpperCase());

		el.on("animationend", () =>
		{
			el.removeClass("ans-box-filled-anim");
		});
	}
}

function do_press_backspace()
{
	if(game._try_freeze.count() > 0 ||
	   game.game_over())
	{
		return;
	}

	if(try_ans.length)
	{
		try_ans.splice(try_ans.length - 1, 1);

		const r = game.attempt_number() + 1;
		const c = try_ans.length + 1;
		const id = get_ans_box_id(r, c);
		let el = $("#" + id);

		el.removeClass("ans-box-filled");
		el.addClass("ans-box-empty");

		el.html("");
	}
}

function do_press_enter()
{
	if(game._try_freeze.count() > 0 ||
	   game.game_over())
	{
		return;
	}

	if(game.answer(try_ans))
	{
		try_ans = [];
	}
}

function handle_key_down(event)
{
	if(game.attempt_number() < game.attempt_max())
	{
		let key = event.key;
		if(key == "Enter")
		{
			do_press_enter();
		}
		else if(key == "Backspace")
		{
			do_press_backspace();
		}
		else if(key.length == 1 && key.match("[a-zA-Z]"))
		{
			do_add_letter(key);
		}
	}
}

function get_encrypted_word_from_url()
{
	let f = window.location.href;
	f = f.split('?');

	if(f.length != 2)
	{
		return "";
	}

	rq = request_field_to_object(f[1]);
	if(!("wordcode" in rq))
	{
		return "";
	}

	return rq.wordcode;
}

function get_word_from_url()
{
	let ew = get_encrypted_word_from_url();
	if(ew.length)
	{
		return decrypt_word(ew);
	}

	return ew.split('');
}