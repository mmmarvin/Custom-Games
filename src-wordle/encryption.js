function encrypt_word(word)
{
	let r = [];

	word = word.toLowerCase();
	word = window.btoa(word);
	r = encodeURIComponent(word).split('');
	
	return r;
}

function decrypt_word(word)
{
	let r = [];

	word = decodeURIComponent(word);
	word = window.atob(word);
	r = word.split('');
	
	return r;
}