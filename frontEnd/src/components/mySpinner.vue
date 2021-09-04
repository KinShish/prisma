<template lang="pug" functional>
	div(key="mySpinner")
		.zoneSpin.z-1
			.c-1
		.zoneSpin.z-2
			.c-2
		.zoneSpin.z-3
			.c-3
		.zoneSpin.z-4
			.c-4
		.zoneSpin.z-5
			.c-5
		.zoneSpin.z-6
			.c-6
		.zoneSpin.z-7
			.c-7
		.zoneSpin.z-8
			.c-8
</template>

<style scoped>
.spin{
	position: relative;
	width: 200px;
	margin: auto;
}
.zonePhoto{
	position: relative;
}
.zoneSpin{
	position:absolute;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
	width:208px;
	height:208px;
	margin-top: 50px;
	-webkit-animation-name: spin;
	-webkit-animation-iteration-count: infinite;
	-webkit-animation-timing-function: linear;
	animation-name: spin;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}
.c-1 {height: 128px;
	width: 128px;
	left:36px;
	top:36px;
	background: #990000;
}
.c-2 {
	height: 112px;
	width: 112px;
	left:44px;
	top:44px;
	background: #cc2200;
}
.c-3 {
	height: 96px;
	width: 96px;
	left:52px;
	top:52px;
	background: #ee5500;
}
.c-4 {
	height: 80px;
	width: 80px;
	left:60px;
	top:60px;
	background: #eecc00;
}
.c-5 {
	height: 64px;
	width: 64px;
	left:68px;
	top:68px;
	background: #999900;
}
.c-6 {
	height: 48px;
	width: 48px;
	left:72px;
	top:72px;
	background: #557700;
}
.c-7 {
	height: 32px;
	width: 32px;
	left:84px;
	top:84px;
	background: #003388;
}
.c-8 {
	height: 16px;
	width: 16px;
	left:100px;
	top:100px;
	background: #0099cc;
}
.c-1,
.c-2,
.c-3,
.c-4,
.c-5,
.c-6,
.c-7,
.c-8{
	position:absolute;
	border-bottom: none;
	border-radius: 50%;
	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
.z-1{
	-webkit-animation-duration: 1700ms;
	animation-duration: 1700ms;
}
.z-2{
	-webkit-animation-duration: 1500ms;
	animation-duration: 1500ms;
}
.z-3{
	-webkit-animation-duration: 1300ms;
	animation-duration: 1300ms;
}
.z-4{
	-webkit-animation-duration: 1100ms;
	animation-duration: 1100ms;
}
.z-5{
	-webkit-animation-duration: 900ms;
	animation-duration: 900ms;
}
.z-6{
	-webkit-animation-duration: 700ms;
	animation-duration: 700ms;
}
.z-7{
	-webkit-animation-duration: 500ms;
	animation-duration: 500ms;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@-webkit-keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
@media (max-width: 400px) {
	.c-1 {
		height: 80px;
		width: 80px;
		left: 70px;
		top: 70px;
		background: #990000;
	}
	.c-2 {
		height: 68px;
		width: 68px;
		left: 76px;
		top: 76px;
		background: #cc2200;
	}
	.c-3 {
		height: 70px;
		width: 70px;
		left: 74px;
		top: 74px;
		background: #ee5500;
	}
	.c-4 {
		height: 48px;
		width: 48px;
		left: 81px;
		top: 81px;
		background: #eecc00;
	}
	.c-5 {
		height: 38px;
		width: 38px;
		left: 88px;
		top: 88px;
		background: #999900;
	}
	.c-6 {
		height: 30px;
		width: 30px;
		left: 92px;
		top: 92px;
		background: #557700;
	}
	.c-7 {
		height: 24px;
		width: 24px;
		left: 98px;
		top: 98px;
		background: #003388;
	}
	.c-8 {
		height: 23px;
		width: 23px;
		left:100px;
		top:100px;
		background: #0099cc;
	}
}
</style>
