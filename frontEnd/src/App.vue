<template lang="pug">
	div
		div(v-if="$route.name==='index'" key="1")
			h1 index
				router-link(to="/upload") upload
				p(v-for="item in 5") {{item}}
		transition(mode="out-in" name="opacity")
			keep-alive
				router-view
</template>

<script>
export default {
	name: 'App',
	created() {
		/*this.axios
			.get('')
			.then((res) => {
				console.log(res)
			})*/
	}
}
</script>
<style>
	/*Анимация перехода начало*/
	.opacity-enter-active {
		opacity: 1;
		transition: all .25s ease;
	}
	.opacity-enter, .opacity-leave-to {
		opacity: 0;
		transition: all .25s ease;
	}
	/*Анимация перехода конец*/
</style>