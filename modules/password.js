function generate(length, options){
	const sets=[];
	if(options.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
	if(options.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	if(options.digits) sets.push('0123456789');
	if(options.symbols) sets.push('!@#$%^&*()-_=+[]{};:,.<>?/');
	if(sets.length===0) return '';
	let password='';
	while(password.length<length){
		const pool = sets.join('');
		const c = pool[Math.floor(Math.random()*pool.length)];
		password+=c;
	}
	return password;
}

function strength(pw){
	let score=0;
	if(pw.length>=12) score++;
	if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
	if(/\d/.test(pw)) score++;
	if(/[^\w]/.test(pw)) score++;
	return ['Weak','Fair','Good','Strong','Very strong'][score]||'Very weak';
}

export async function render(){
	const el=document.createElement('section'); el.className='card';
	el.innerHTML=`
		<h2>Password Generator</h2>
		<div class="row cols-2">
			<label><span>Length</span><input id="len" class="input" type="number" min="6" max="64" value="16"/></label>
			<div>
				<label><input id="lower" type="checkbox" checked/> Lowercase</label>
				<label><input id="upper" type="checkbox" checked/> Uppercase</label>
				<label><input id="digits" type="checkbox" checked/> Digits</label>
				<label><input id="symbols" type="checkbox"/> Symbols</label>
			</div>
			<button id="make" class="button">Generate</button>
			<output id="out" aria-live="polite"></output>
		</div>`;
	const out=el.querySelector('#out');

	function run(){
		const len=parseInt(el.querySelector('#len').value)||16;
		const opts={lower:el.querySelector('#lower').checked, upper:el.querySelector('#upper').checked, digits:el.querySelector('#digits').checked, symbols:el.querySelector('#symbols').checked};
		const pw=generate(len,opts);
		const label=strength(pw);
		out.innerHTML = `<div class=\"card\"><div style=\"word-break:break-all\">${pw}</div><div class=\"muted\">Strength: ${label}</div><button class=\"button\" id=\"copy\">Copy</button></div>`;
		const btn=el.querySelector('#copy');
		btn && btn.addEventListener('click',()=>{ navigator.clipboard.writeText(pw); btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',1200); });
	}

	el.querySelector('#make').addEventListener('click',run);
	run();
	return el;
}

