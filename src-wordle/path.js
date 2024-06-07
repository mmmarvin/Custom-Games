function path_join(path1, path2)
{
	path1 = path1.split('/');
	path2 = path2.split('/');

	return path1.concat(path2).join('/');
}

function path_basename(path)
{
	return path.split('/').pop();
}

function path_dirname(path)
{
	path = path.split('/');
	path.pop();

	return path.join('/');
}

function path_extname(path)
{
	return path_basename(path).split('.').pop();
}