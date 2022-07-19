<script>
	import { onDestroy } from 'svelte'
  const frames = ['-','/','|','\\']
	let idx = 0
	const rotator = setInterval(() => {idx += 1; idx %= frames.length;}, 90)
  onDestroy(() => {clearInterval(rotator)})
</script>

<pre style:font-family='monospace' style:font-size=20px >Loading... {frames[idx]}</pre>
