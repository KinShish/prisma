<template lang="pug">
	div
		div(v-if="$route.name==='index'")
			.row.col-12
				.col-6
					.tringleMan
						.dialogBlock Вас приветствует призма, я помогаю распределять
							.tringle
						img(src="./assets/man.svg")
				.col-6
					h1 авторизация
			//file-upload(:directory="true" :multiple="true" :thread="3" :drop="false" :drop-directory="true" @input="$_image_inputFilter" ref="upload")
				div Загрузить документы
				mySpinner
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
	html{
		height: 100vh;
	}
	body{
		background: rgb(220,220,221);
		background: -moz-linear-gradient(135deg, rgba(220,220,221,1) 0%, rgba(53,52,68,1) 100%);
		background: -webkit-linear-gradient(135deg, rgba(220,220,221,1) 0%, rgba(53,52,68,1) 100%);
		background: linear-gradient(135deg, rgba(220,220,221,1) 0%, rgba(53,52,68,1) 100%);
	}
	.tringleMan{
		position: absolute;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		bottom: 150px;
		left: 50px;
	}
	.dialogBlock{
		background: red;
		width: 250px;
		position: relative;
		left: 250px;
		border-radius: 5px 5px 5px 0;
		padding: 20px;
		color: white;
		font-size: 20px;
		text-align: center;
	}
	.dialogBlock:after{
		content: '';
		position: absolute;
		left: -22px;
		bottom: -26px;
		border: 20px solid transparent;
		border-top: 30px solid red;
		transform: rotate(45deg);
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