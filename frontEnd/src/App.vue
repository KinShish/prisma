<template lang="pug">
	div
		div(v-if="$route.name==='index'")
			.blockLogo
				img(src="./assets/logo.png")
				h1 PRISMA
			file-upload(:directory="true" :multiple="true" :thread="3" :drop="false" :drop-directory="true" @input="$_image_inputFilter" ref="upload")
			transition(mode="out-in" name="opacity")
				label.uploadBlock(for="file" v-if="!spinner")
					img(src="./assets/fileUpload.svg")
					div Загрузить документы
				mySpinner(v-else)
		transition(mode="out-in" name="opacity")
			keep-alive
				router-view
</template>

<script>
export default {
	name: 'App',
	data(){
		return{
			access:['xlsx','xlsm','xlsb','xls','ods','fods','csv','txt','sylk','html','dif','dbf','rtf','prn','eth','pdf'],
			spinner:false,
		}
	},
	components:{
		'FileUpload':()=>import('vue-upload-component'),
	},
	methods:{
		$_image_inputFilter(files){
			console.log(files)
			this.spinner=true;
			setTimeout(()=>{
				this.spinner=false;
				this.$router.push('/result')
			},5000)
			/*this.axios.post(this.$server+'',{files})
			.then((res) => {
				console.log(res)
			})*/
		}
	},
}
</script>
<style>
	html,body{
		background-color: black;
		color: white;
	}
	.blockLogo{
		display: grid;
		place-content: center;
		text-align: center;
		color: white;
	}
	.uploadBlock{
		color: white;
		border: 2px solid #7ba4b6;
		border-radius: 5px;
		width: 250px;
		height: 250px;
		display: grid;
		place-content: center;
		font-size: 20px;
		cursor: pointer;
		margin: 50px auto 0 auto;
	}
	.uploadBlock img{
		height: 200px;
	}
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