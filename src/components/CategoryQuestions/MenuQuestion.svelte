<script>
	export let state;

	import { openModal } from 'svelte-modals';
	import OptionsModal from './OptionsModal.svelte';
	import Required from '../Required.svelte';

	$: state.maxLength = Math.min(25, state.maxLength);
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
		Maximum values
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="How many choices can be selected?"
		/>
		<input
			type="number"
			class="form-input input text-sm"
			required
			min="1"
			max="25"
			bind:value={state.maxLength}
		/>
	</label>
</div>
<div>
	<label class="font-medium">
		Minimum values
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The minimum number of select choices"
		/>
		<input
			type="number"
			class="form-input input text-sm"
			default="1"
			required
			min="0"
			max="25"
			bind:value={state.minLength}
		/>
	</label>
</div>
<div>
	<div class="font-medium">
		Options ({state.options.length}/25)
		<Required />
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="The options that members can choose from"
		/>
		<button
			type="button"
			class="hover:text-yellow-300 text-yellow-500 dark:hover:text-yellow-500/50 dark:text-yellow-500 px-2 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
			on:click={() => openModal(OptionsModal, { id: state.id })}
		>
			<i class="fa-solid fa-pencil" />
			Edit
		</button>
	</div>
	<div>
		<ul class="list-disc list-inside">
			{#each state.options as option}
				<li>{option.label}</li>
			{/each}
		</ul>
	</div>
</div>
<div>
	<div>
		<label class="font-medium">
			Placeholder
			<i
				class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
				title="The placeholder (label)"
			/>
			<input
				type="text"
				class="form-input input text-sm"
				maxlength="150"
				bind:value={state.placeholder}
			/>
		</label>
	</div>
</div>
