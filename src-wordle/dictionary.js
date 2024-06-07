function get_dictionary_location()
{
	return path_join(path_dirname(document.location.href), "src-wordle/dictionary.json");
}

class Dictionary
{
	constructor()
	{
		this._dictionary = new Set();
	}

	load_dictionary(done)
	{
		let local_dictionary = localStorage.getItem("dictionary");
		if(!local_dictionary)
		{
			let req = $.ajax({
				method: "GET",
				url: get_dictionary_location()
			});

			req.done((msg) => {
				local_dictionary = msg;
				if(!("version" in local_dictionary ) ||
				   !("words" in local_dictionary))
				{
					done(false, "Cannot load dictionary");
					return;
				}

				console.log(`Downloaded dictionary version ${local_dictionary.version}`);

				local_dictionary = local_dictionary.words;
				if(local_dictionary.length)
				{
					localStorage.setItem("dictionary", JSON.stringify(local_dictionary));
					for(const word of local_dictionary)
					{
						this._dictionary.add(word.toLowerCase());
					}

					done(true, "");
					return;
				}
				else
				{
					// ERROR: loaded dictionary may be corrupted
					done(false, "Cannot load dictionary");
					return;
				}
			});

			req.fail((_, text_status) => {
				// ERROR: cannot load dictionary
				done(false, "There was a problem downloading the dictionary");
				return;
			});
		}
		else
		{
			local_dictionary = JSON.parse(local_dictionary);
			if(local_dictionary.length)
			{
				for(const word of local_dictionary)
				{
					this._dictionary.add(word.toLowerCase());
				}

				done(true, "");
			}
			else
			{
				// ERROR: cannot load dictionary, reload
				// the dictionary
				localStorage.removeItem("dictionary");
				this.load_dictionary();
			}
		}
	}

	is_word_valid(word)
	{
		if(typeof word != "string" && !(word instanceof String))
		{
			word = word.join('');
		}

		return this._dictionary.has(word.toLowerCase());
	}
}

var dictionary = new Dictionary();