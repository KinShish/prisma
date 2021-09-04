<template lang="pug">
	div
		h1 upload
		transition-group(name="listTransaction")
			p(v-for="item in files" :key="item") {{item}}
</template>

<script>
export default {
	data(){
		return{
			files:[]
		}
	},
	created() {
		setTimeout(()=>{
			this.files=['sad1','asd2','asd3']
		},3000)
	}
}
</script>

<style scoped>
/*Анимация перехода начало*/
.listTransaction-enter-active {
	opacity: 1;
	position: relative;
	left: 0;
	transition: all .5s ease;
}
.listTransaction-enter, .listTransaction-leave-to {
	opacity: 0;
	position: relative;
	left: -200px;
	transition: all .5s ease;
}
/*Анимация перехода конец*/
</style>