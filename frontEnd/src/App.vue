<template lang="pug">
	.mainBlock
		div(v-if="$route.name==='index'")
			.logoBlock
				img(src="./assets/logo.svg")
			.mainBlockIndex
				.man
					.message(@click="$_app_countSmallMan") Вас приветствует
						b   PriSma,
						|   я помогаю распределять
					img(src="./assets/man.svg" :class="{'animMan':loadFile}")
				.uploadFile
					.lineMan
						img(src="./assets/smallMan.svg" v-for="item in countMan" :key="item")
					label.blockUpload(for="file" v-if="!loadFile")
						.uploadBtn загрузить файлы
					.blockUpload(v-else)
						b-spinner(height="100")
		file-upload(:directory="true" :multiple="true" :thread="3" :drop="false" :drop-directory="true" @input="$_image_inputFilter" ref="upload")
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
			interval:null,
			countMan:0,
			loadFile:false
		}
	},
	components:{
		'FileUpload':()=>import('vue-upload-component'),
	},
	methods:{
		$_app_countSmallMan(){
			this.loadFile=true;
			this.interval=setInterval(()=>{
				if(this.countMan!==6){
					this.countMan++
				}else{
					this.countMan=1;
				}
			},700)
		},
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
	.mainBlock{
		width: 1200px;
		margin: 0 auto;
		background: #E5E5E5;
		height: 100vh;
	}
	html{
		height: 100vh;
	}
	.blockUpload{
		background: white;
		border-radius: 30px;
		border: 3px dashed #6CB4CB;
		padding: 130px;
		display: grid;
		place-content: center;
		height: 350px;
		width: 460px;
		position: relative;
	}
	.blockUpload .spinner-border{
		height: 100px;
		width: 100px;
		border-width: 7px;
		color: #563BC2 !important;
	}
	.blockUpload .uploadBtn{
		background: #F26126;
		padding: 30px;
		color: white;
		text-align: center;
		border-radius: 13px;
	}
	.mainBlockIndex{
		display: flex;
		padding-top: 250px;
		position: relative;
		margin: 0 auto;
	}
	.man{
		flex: 1;
		margin-top: -100px;
		padding-left: 100px;
	}
	.man img{
		height: 400px;
	}
	.animMan{
		animation: rotateMan 4.5s ease infinite;
	}
	@keyframes rotateMan {
		1%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(360deg);
		}
	}
	.uploadFile{
		flex: 1;
		display: grid;
		place-content: center;
		padding-right: 70px;
	}
	.logoBlock{
		width: 100%;
		text-align: right;
		border-bottom: 4px solid #563BC2;
		padding-top: 15px;
	}
	.logoBlock img{
		margin-bottom: -20px;
	}
	.message{
		background: #F26126;
		text-align: center;
		padding: 20px;
		color: white;
		font-size: 25px;
		border-radius: 30px;
		position: relative;
		right: -250px;
		bottom: 30px;
	}
	.message:after{
		content: '';
		position: absolute;
		border: 23px solid transparent;
		border-left: 46px solid #F26126;
		bottom: -16px;
		left: -3px;
		transform: rotate(12deg);
	}
	.lineMan{
		padding-left: 5px;
		min-height: 55px;
	}
	.lineMan img{
		margin-right: 19px;
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