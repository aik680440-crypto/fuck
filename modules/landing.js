export async function render(){
	const wrap = document.createElement('section');
	wrap.className='card';
	wrap.innerHTML = `
		<h2>Welcome</h2>
		<p class="muted">Choose a tool above to get started.</p>
	`;
	return wrap;
}

