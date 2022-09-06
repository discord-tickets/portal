<script>
	export let state;
	import Required from '../Required.svelte';
</script>

<div>
	<label class="font-medium">
		Label
		<Required />
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The title of the question"
		/>
		<input
			type="text"
			class="form-input input text-sm"
			required
			maxlength="45"
			bind:value={state.label}
		/>
	</label>
</div>
<div>
	<label class="font-medium">
		Maximum length
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The maximum input length"
		/>
		<input
			type="number"
			class="form-input input text-sm"
			required
			min="1"
			max="1000"
			bind:value={state.maxLength}
		/>
	</label>
</div>
<div>
	<label class="font-medium">
		Minimum length
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The minimum input length"
		/>
		<input
			type="number"
			class="form-input input text-sm"
			required
			min="0"
			max="1000"
			bind:value={state.minLength}
		/>
	</label>
</div>
<div>
	<label class="font-medium">
		Placeholder
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The placeholder value, such as a hint"
		/>
		<input
			type="text"
			class="form-input input text-sm"
			maxlength="100"
			bind:value={state.placeholder}
		/>
	</label>
</div>
<div>
	<label for="required" class="font-medium">
		Required
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="Require input?"
		/>
		<input
			type="checkbox"
			id="required"
			name="required"
			class="form-checkbox"
			bind:checked={state.required}
		/>
	</label>
</div>
<div>
	<label class="font-medium">
		Style
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="How big should the input box be?"
		/>
		<select class="form-multiselect input" required bind:value={state.style}>
			<option value={1} class="p-1">
				<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
				Short (single-line)
			</option>
			<option value={2} class="p-1">
				<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
				Long (multi-line)
			</option>
		</select>
	</label>
</div>
<div>
	<label class="font-medium">
		Value
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="A pre-filled value"
		/>
		<textarea class="form-input input text-sm" maxlength="1000" bind:value={state.value} />
	</label>
</div>
