class SyncLock
{
	constructor()
	{
		this._n_lock = 0;
	}

	lock()
	{
		this._n_lock += 1;
	}

	unlock()
	{
		this._n_lock -= 1;
	}

	count()
	{
		return this._n_lock;
	}
}