<!-- 关于程序(未做) -->
<template>
	<view>
		<rich-text :nodes="nodes"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nodes: "<h1 style='text-align: center; margin-top: 80px'>思维帮</h1>"
			}
		}
	}
</script>

<style lang="scss">
	page,
	body {
		background: url(https://img1.baidu.com/it/u=2824142902,1880332962&fm=26&fmt=auto)no-repeat center center fixed; //参数解释请往下看
		background-size: cover;
		box-sizing: border-box;
	}
</style>
