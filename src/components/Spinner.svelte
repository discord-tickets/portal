<div class="flex justify-center">
	<div class="flex items-center">
		<div class="spinner">
			<div class="cube1"></div>
			<div class="cube2"></div>
		</div>
	</div>
</div>

<style>
	.spinner {
		margin: 60px auto;
		width: 40px;
		height: 40px;
		position: relative;
	}

	.cube1,
	.cube2 {
		background-color: #5865f2;
		width: 15px;
		height: 15px;
		position: absolute;
		top: -10px;
		left: -10px;

		-webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
		animation: sk-cubemove 1.8s infinite ease-in-out;
	}

	.cube2 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}

	@-webkit-keyframes sk-cubemove {
		25% {
			-webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
		}

		50% {
			-webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
		}

		75% {
			-webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
		}

		100% {
			-webkit-transform: rotate(-360deg);
		}
	}

	@keyframes sk-cubemove {
		25% {
			transform: translateX(42px) rotate(-90deg) scale(0.5);
			-webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
		}

		50% {
			transform: translateX(42px) translateY(42px) rotate(-179deg);
			-webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
		}

		50.1% {
			transform: translateX(42px) translateY(42px) rotate(-180deg);
			-webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
		}

		75% {
			transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
			-webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
		}

		100% {
			transform: rotate(-360deg);
			-webkit-transform: rotate(-360deg);
		}
	}
</style>
