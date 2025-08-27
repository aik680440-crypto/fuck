function load(){
	try{ return JSON.parse(localStorage.getItem('todo-list')||'[]'); }catch{ return []; }
}
function save(list){ localStorage.setItem('todo-list', JSON.stringify(list)); }

export async function render(){
	const el=document.createElement('section'); el.className='card';
	el.innerHTML=`
		<h2>To-do</h2>
		<form id="form" class="row cols-2" autocomplete="off">
			<label>
				<span>Task</span>
				<input id="title" class="input" required maxlength="140" placeholder="e.g., Pay electricity bill"/>
			</label>
			<label>
				<span>Due date</span>
				<input id="due" class="input" type="date"/>
			</label>
			<label>
				<span>Priority</span>
				<select id="priority" class="input">
					<option>Low</option><option selected>Medium</option><option>High</option>
				</select>
			</label>
			<div>
				<button class="button" type="submit">Add</button>
			</div>
		</form>
		<ul id="list" style="list-style:none;padding:0;margin-top:12px"></ul>
	`;
	const listEl=el.querySelector('#list');
	let items = load();

	function renderList(){
		listEl.innerHTML='';
		items.sort((a,b)=> (b.priorityOrder-a.priorityOrder) || (a.due||'').localeCompare(b.due||''));
		items.forEach((it,idx)=>{
			const li=document.createElement('li');
			li.className='card';
			li.style.display='grid';
			li.style.gridTemplateColumns='1fr auto';
			li.style.alignItems='center';
			li.style.margin='8px 0';
			li.innerHTML=`<div>
				<div><input type="checkbox" ${it.done?'checked':''} aria-label="Mark complete" data-idx="${idx}" class="chk"/> <strong>${it.title}</strong> <span class="muted">${it.due?('· due '+it.due):''}</span></div>
				<div class="muted">Priority: ${it.priority}</div>
			</div>
			<div>
				<button data-idx="${idx}" class="del button" style="background:#ef4444">Delete</button>
			</div>`;
			listEl.appendChild(li);
		});
	}

	renderList();

	el.addEventListener('click', (e)=>{
		const t=e.target;
		if(t.classList && t.classList.contains('del')){
			const i=Number(t.dataset.idx);
			items.splice(i,1); save(items); renderList();
		}
		if(t.classList && t.classList.contains('chk')){
			const i=Number(t.dataset.idx);
			items[i].done = t.checked; save(items); renderList();
		}
	});

	el.querySelector('#form').addEventListener('submit',(e)=>{
		e.preventDefault();
		const title=el.querySelector('#title').value.trim();
		const due=el.querySelector('#due').value||'';
		const priority=el.querySelector('#priority').value;
		if(!title){ return; }
		const priorityOrder = {Low:0,Medium:1,High:2}[priority]||1;
		items.push({title,due,priority,priorityOrder,done:false,createdAt:Date.now()});
		save(items);
		e.target.reset();
		renderList();
	});

	return el;
}

