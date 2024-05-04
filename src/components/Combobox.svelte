<script>
	export let attributes;
	export let placeholder;
	export let options;
	export let value;
	
	import { Combobox } from 'bits-ui';
	import { scale } from 'svelte/transition';

	let inputValue = '';
	let touchedInput = false;

	$: filtered =
		inputValue && touchedInput
			? options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
			: options;
</script>

<Combobox.Root {...attributes} items={filtered} bind:inputValue bind:touchedInput>
	<div class="relative flex flex-col justify-center">
		<!-- top-1/2  -translate-y-1/2 -->
		<i
			class="fa-solid fa-list absolute start-3 size-6 text-gray-500 dark:text-slate-400"
		></i>
		<!-- placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background -->
		<Combobox.Input
			class="form-input input h-input truncate rounded-9px px-11 text-sm"
			{placeholder}
			aria-label={placeholder}
		/>
		<!-- top-1/2 -translate-y-1/2   -->
		<i
			class="fa-solid fa-caret-down absolute end-3 size-6 text-gray-500 dark:text-slate-400"
		></i>
	</div>

	<Combobox.Content
		class="w-full rounded-xl border border-gray-500 dark:border-slate-400 bg-gray-100 dark:bg-slate-800 px-1 py-3 shadow-popover outline-none"
		transition={scale}
		sideOffset={8}
	>
		{#each filtered as option (option.value)}
			<Combobox.Item
				class=" flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[selected]:bg-green-400 data-[highlighted]:bg-red-400"
				value={option.value}
				label={option.label}
			>
				{option.label}
				<Combobox.ItemIndicator class="ml-auto" asChild={false}>
					<i class="fa-solid fa-check"></i>
				</Combobox.ItemIndicator>
			</Combobox.Item>
		{:else}
			<span class="block px-5 py-2 text-sm">No results found</span>
		{/each}
	</Combobox.Content>
	<Combobox.HiddenInput name={placeholder} bind:value={value} />
</Combobox.Root>
