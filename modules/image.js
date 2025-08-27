function fileToImage(file){
	return new Promise((resolve,reject)=>{
		const img=new Image();
		img.onload=()=>resolve(img);
		img.onerror=reject;
		img.src=URL.createObjectURL(file);
	});
}

async function compressImage(file, quality=0.7){
	const img = await fileToImage(file);
	const canvas=document.createElement('canvas');
	const max=1600;
	const scale=Math.min(1, max/Math.max(img.width,img.height));
	canvas.width=Math.round(img.width*scale);
	canvas.height=Math.round(img.height*scale);
	const ctx=canvas.getContext('2d');
	ctx.drawImage(img,0,0,canvas.width,canvas.height);
	return new Promise(resolve=>{ canvas.toBlob(b=>resolve(b), 'image/jpeg', quality); });
}

export async function render(){
	const el=document.createElement('section'); el.className='card';
	el.innerHTML=`
		<h2>Image Compressor</h2>
		<div class="row">
			<input id="file" type="file" accept="image/*" aria-label="Select image"/>
			<label>
				<span>Quality</span>
				<input id="quality" class="input" type="range" min="0.1" max="1" step="0.05" value="0.7"/>
			</label>
			<button id="go" class="button">Compress</button>
			<div id="out"></div>
		</div>`;
	const fileEl=el.querySelector('#file');
	const qualityEl=el.querySelector('#quality');
	const out=el.querySelector('#out');

	el.querySelector('#go').addEventListener('click', async ()=>{
		const f=fileEl.files && fileEl.files[0];
		if(!f){ out.innerHTML='<p class="muted">Choose an image first.</p>'; return; }
		out.textContent='Compressing…';
		const q=parseFloat(qualityEl.value)||0.7;
		const blob=await compressImage(f,q);
		const url=URL.createObjectURL(blob);
		const a=document.createElement('a');
		a.href=url; a.download='compressed.jpg'; a.className='button'; a.textContent='Download compressed image';
		out.innerHTML=''; out.appendChild(a);
	});

	return el;
}

