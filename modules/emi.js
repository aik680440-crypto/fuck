function formatCurrency(n){
	return new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(n);
}

function calculateEmi(principal, annualRatePercent, years){
	const monthlyRate = (annualRatePercent/100)/12;
	const months = years*12;
	if(monthlyRate===0){ return principal/months; }
	const numerator = principal*monthlyRate*Math.pow(1+monthlyRate,months);
	const denom = Math.pow(1+monthlyRate,months)-1;
	return numerator/denom;
}

export async function render(){
	const el = document.createElement('section');
	el.className='card';
	el.innerHTML = `
		<h2>EMI Calculator</h2>
		<div class="row cols-2">
			<label>
				<span>Loan amount</span>
				<input id="amount" class="input" type="number" min="0" step="100" placeholder="e.g., 250000" aria-describedby="amt-hint"/>
				<small id="amt-hint" class="muted">Enter principal amount</small>
			</label>
			<label>
				<span>Annual interest %</span>
				<input id="rate" class="input" type="number" min="0" max="100" step="0.01" placeholder="e.g., 6.5"/>
			</label>
			<label>
				<span>Term (years)</span>
				<input id="years" class="input" type="number" min="1" step="1" placeholder="e.g., 30"/>
			</label>
			<div>
				<button id="calc" class="button" aria-label="Calculate monthly payment">Calculate</button>
			</div>
		</div>
		<div id="result" style="margin-top:12px"></div>
	`;
	const amount=el.querySelector('#amount');
	const rate=el.querySelector('#rate');
	const years=el.querySelector('#years');
	const out=el.querySelector('#result');

	function show(){
		const p=parseFloat(amount.value);
		const r=parseFloat(rate.value);
		const y=parseFloat(years.value);
		if(!isFinite(p)||!isFinite(r)||!isFinite(y)||p<=0||r<0||y<=0){
			out.innerHTML='<p class="muted">Enter valid positive values.</p>';
			return;
		}
		const monthly = calculateEmi(p,r,y);
		const total = monthly*(y*12);
		const interest = total - p;
		out.innerHTML = `
			<div class="row">
				<div class="card"><strong>Monthly payment:</strong> ${formatCurrency(monthly)}</div>
				<div class="card"><strong>Total interest:</strong> ${formatCurrency(interest)}</div>
				<div class="card"><strong>Total paid:</strong> ${formatCurrency(total)}</div>
			</div>`;
	}
	el.querySelector('#calc').addEventListener('click', show);
	[amount,rate,years].forEach(i=>i.addEventListener('input', show));
	return el;
}

