function request_field_to_object(request_field) 
{
	let ret = {};

	let t1 = request_field.split("&");
	for(const i in t1)
	{
		let t2 = t1[i].split("=");
		if(t2.length == 2)
		{
			ret[t2[0]] = t2[1];
		}
	}

	return ret;
}