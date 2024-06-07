function get_ans_box_id(row, col)
{
	return "ans-r" + row.toString() + "-c" + col.toString();
}

class Game
{
	constructor(cor_word, on_finish, try_max = 6)
	{
		this.restart(cor_word, on_finish, try_max);
	}

	restart(cor_word, on_finish, try_max)
	{
		this._on_finish = on_finish;
		this._try_n = 0;
		this._try_max = try_max;
		this._cor_word = cor_word;
		this._overall_letter_status = create_letter_status();
		this._try_freeze = new SyncLock();
		this._word_attempts = [
			"",
			"",
			"",
			"",
			"",
			""
		];
		this._word_attempts_status = [];
		this._game_over = false;

		this._restore_progress();
	}

	answer(word, animate = true)
	{
		if(word.length == this._cor_word.length)
		{
			let word_str = word.join('');
			if(dictionary.is_word_valid(word_str))
			{
				this._word_attempts[this._try_n] = word_str;
				localStorage.setItem("progress", this._generate_progress_JSON());

				const row = this._try_n + 1;
				const [ letter_status, letter_frequency ] = this._generate_letter_status(word);
				this._word_attempts_status.push(letter_status);

				let done = () => {};
				if(letter_frequency.empty())
				{
					done = () =>
					{
						this._on_finish(true, this._word_attempts_status);
						this._game_over = true;
					};
				}
				else
				{
					this._try_n += 1;
					if(this._try_n == this._try_max)
					{
						done = () =>
						{
							this._on_finish(false, this._word_attempts_status);
							this._game_over = true;
						};
					}
				}
				this._update_answer_boxes(row, letter_status, animate, done);
				this._update_letter_boxes(letter_status);

				return true;
			}
			else
			{
				show_quick_message("Not in word list", EQM_LOGO.EQML_ERROR);
			}
		}
		else
		{
			show_quick_message("Not enough letters", EQM_LOGO.EQML_ERROR);
		}

		return false;
	}

	attempt_number()
	{
		return this._try_n;
	}

	attempt_max()
	{
		return this._try_max;
	}

	game_over()
	{
		return this._game_over;
	}

	_update_answer_box(element, status)
	{
		switch(status)
		{
		case ELETTER_STATUS.ELS_INCORRECT:
			element.addClass("ans-box-letter-incorrect");
			break;
		case ELETTER_STATUS.ELS_PARTIAL:
			element.addClass("ans-box-letter-partial");
			break;
		case ELETTER_STATUS.ELS_CORRECT:
			element.addClass("ans-box-letter-correct");
			break;
		}
	}

	_update_answer_boxes(row, letter_status, animate, done)
	{
		for(const i in letter_status)
		{
			const c = parseInt(i) + 1;
			const id = get_ans_box_id(row, c);
			let el = $(`#${id}`);

			el.html(letter_status[i].letter.toUpperCase());
			if(animate)
			{
				this._try_freeze.lock();
				let delay = (c - 1) * 100;

				el.addClass("ans-box-anim-spin-in");
				el.attr("style", `animation-delay: ${delay}ms;`);
				el.on("animationend", (event) =>
				{
					if(event.originalEvent.animationName == "anim-box-spin-in")
					{
						el.attr("style", `animation-delay: 0ms;`);
						el.removeClass("ans-box-anim-spin-in");
						el.addClass("ans-box-anim-spin-out");

						this._update_answer_box(el, letter_status[i].status);
					}
					else if(event.originalEvent.animationName == "anim-box-spin-out")
					{
						el.removeClass("ans-box-anim-spin-out");
						this._try_freeze.unlock();

						if(!this._try_freeze.count())
						{
							done();
						}

						el.off("animationend");
					}
				});
			}
			else
			{
				this._update_answer_box(el, letter_status[i].status);
				if(i == letter_status.length - 1)
				{
					done();
				}
			}
		}
	}

	_update_letter_boxes(letter_status)
	{
		for(const ls of letter_status)
		{
			if(is_new_status_stronger(this._overall_letter_status[ls.letter], ls.status))
			{
				let el = $(`#key-${ls.letter}`);
				let sstr = status_to_string(this._overall_letter_status[ls.letter]);
				el.removeClass(`key-box-${sstr}`);

				this._overall_letter_status[ls.letter] = ls.status;
				sstr = status_to_string(ls.status);
				el.addClass(`key-box-${sstr}`);
			}
		}
	}

	_generate_letter_status(word)
	{
		let letter_status = [];
		let letter_frequency = new LetterFrequency(cor_ans);

		for(const i in word)
		{
			const c1 = word[i];
			const c2 = cor_ans[i];

			if(c1 == c2)
			{
				letter_frequency.subtract_letter_count(c1);
				letter_status.push({ letter: c1, status: ELETTER_STATUS.ELS_CORRECT });
			}
			else
			{
				if(letter_frequency.contains(c1))
				{
					letter_frequency.subtract_letter_count(c1);
					letter_status.push({ letter: c1, status: ELETTER_STATUS.ELS_PARTIAL });
				}
				else
				{
					letter_status.push({ letter: c1, status: ELETTER_STATUS.ELS_INCORRECT });
				}
			}
		}

		return [ letter_status, letter_frequency ];
	}

	_generate_progress_JSON()
	{
		let ret = new Object();

		ret["word"] = this._cor_word.join('');
		for(let i = 0; i < this._try_max; ++i)
		{
			ret[`attempt${i + 1}`] = this._word_attempts[i];
		}

		return JSON.stringify(ret);
	}

	_restore_progress()
	{
		this._clear_word_attempts();

		let progress = localStorage.getItem("progress");
		let cor_word_str = this._cor_word.join('');
		if(!progress)
		{
			localStorage.setItem("progress", this._generate_progress_JSON());
		}
		else
		{
			progress = JSON.parse(progress); // why this works? who knows
			if(progress.word == cor_word_str)
			{
				for(let i = 0; i < 6; ++i)
				{
					let attempt = progress[`attempt${i+1}`];
					if(attempt.length && attempt.length == this._cor_word.length)
					{
						this.answer(attempt.split(''), false);
					}
				}
			}
			else
			{
				localStorage.setItem("progress", this._generate_progress_JSON());
			}
		}
	}

	_clear_word_attempts()
	{
		this._word_attempts = [
			"",
			"",
			"",
			"",
			"",
			""
		];
		this._word_attempts_status = [];
	}
}