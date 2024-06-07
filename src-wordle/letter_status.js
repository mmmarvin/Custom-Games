class LetterFrequency
{
	constructor(word)
	{
		this._word = new Map();

		for(const c of word)
		{
			if(this._word.has(c))
			{
				this._word.set(c, this._word.get(c) + 1);
			}
			else
			{
				this._word.set(c, 1);
			}
		}
	}

	empty()
	{
		return this._word.size == 0;
	}

	contains(c)
	{
		return this._word.has(c);
	}

	subtract_letter_count(c)
	{
		this._word.set(c, this._word.get(c) - 1);
		if(this._word.get(c) == 0)
		{
			this._word.delete(c);
		}
	}
}

const ELETTER_STATUS = Object.freeze({
	ELS_EMPTY: 0,
	ELS_INCORRECT: 1,
	ELS_PARTIAL: 2,
	ELS_CORRECT: 3
});

function status_to_string(status)
{
	if(status == ELETTER_STATUS.ELS_EMPTY)
	{
		return "unused";
	}
	else if(status == ELETTER_STATUS.ELS_INCORRECT)
	{
		return "incorrect";
	}
	else if(status == ELETTER_STATUS.ELS_PARTIAL)
	{
		return "partial";
	}
	else if(status == ELETTER_STATUS.ELS_CORRECT)
	{
		return "correct";
	}

	return "";
}

function is_new_status_stronger(old_letter_status, new_letter_status)
{
	return new_letter_status > old_letter_status;
}

function create_letter_status()
{
	return {
		"a": ELETTER_STATUS.ELS_EMPTY,
		"b": ELETTER_STATUS.ELS_EMPTY,
		"c": ELETTER_STATUS.ELS_EMPTY,
		"d": ELETTER_STATUS.ELS_EMPTY,
		"e": ELETTER_STATUS.ELS_EMPTY,
		"f": ELETTER_STATUS.ELS_EMPTY,
		"g": ELETTER_STATUS.ELS_EMPTY,
		"h": ELETTER_STATUS.ELS_EMPTY,
		"i": ELETTER_STATUS.ELS_EMPTY,
		"j": ELETTER_STATUS.ELS_EMPTY,
		"k": ELETTER_STATUS.ELS_EMPTY,
		"l": ELETTER_STATUS.ELS_EMPTY,
		"m": ELETTER_STATUS.ELS_EMPTY,
		"n": ELETTER_STATUS.ELS_EMPTY,
		"o": ELETTER_STATUS.ELS_EMPTY,
		"p": ELETTER_STATUS.ELS_EMPTY,
		"q": ELETTER_STATUS.ELS_EMPTY,
		"r": ELETTER_STATUS.ELS_EMPTY,
		"s": ELETTER_STATUS.ELS_EMPTY,
		"t": ELETTER_STATUS.ELS_EMPTY,
		"u": ELETTER_STATUS.ELS_EMPTY,
		"v": ELETTER_STATUS.ELS_EMPTY,
		"w": ELETTER_STATUS.ELS_EMPTY,
		"x": ELETTER_STATUS.ELS_EMPTY,
		"y": ELETTER_STATUS.ELS_EMPTY,
		"z": ELETTER_STATUS.ELS_EMPTY
	};
}