<template>
	<view class="content">
		<u-form :model="form">
			<u-form-item label="头像:" label-width="140" label-align="center" left-icon="photo-fill"><u-avatar :src="avatarUrl" size="large"></u-avatar></u-form-item>
			<u-form-item label="昵称:" label-width="140" label-align="center" left-icon="account-fill">
				<u-input v-model="form.nickName" placeholder="请填写昵称" :disabled="disabled"/>
			</u-form-item>
			<u-form-item label="性别:" label-width="140" label-align="center" left-icon="eye-fill">
				<u-input v-model="form.gender" :type="select" @click="show=true" placeholder="请选择性别" :disabled="disabled"/>
				<u-select v-model="show" :list="list" @confirm="confirm" v-if="showButton"></u-select>
			</u-form-item>
			<u-form-item label="地址:" label-width="140" label-align="center" left-icon="home-fill">
				<u-input v-model="form.city" placeholder="请填写地址" :disabled="disabled"/>
			</u-form-item>
			<u-button @click="submit" v-if="showButton" type="primary ">提交</u-button>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showButton: false,
				avatarUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015a465698b54432f87574be965625.png',
				openId: '',
				form: {
					nickName: '未知',
					city: '保密',
					gender: '保密'
				},
				show: false,
				list: [{
						value: '保密',
						label: '保密'
					},
					{
						value: '男',
						label: '男'
					},
					{
						value: '女',
						label: '女'
					}
				],
				select: 'text',
				disabled: true
			}
		},
		onLoad(e) {
			// console.log(e.userId)
			this.getUserInfo(e.userId);
		},
		methods: {
			async getUserInfo(userId) {
				const res = await this.$myRequest({
					url: '/GetUserInfo?userId=' + userId
				})
				this.openId = res.data.openId
				this.avatarUrl = res.data.avatarUrl
				this.form.nickName = res.data.nickName
				this.form.gender = res.data.gender
				this.form.city = res.data.city
				if (this.openId == uni.getStorageSync("openId")){
					this.showButton = true
					this.select = 'select'
					this.disabled = false
				}
			},
			confirm(gender) {
				this.form.gender = gender[0].value;
			},
			async submit(){
				const res = await this.$myRequest({
					url: '/updateUser',
					method: 'POST',
					data:{
						openId: this.openId,
						nickName: this.form.nickName,
						gender: this.form.gender,
						city: this.form.city
					}
				}).then(res => {
					if (res.data == true){
						uni.setStorageSync('author', this.form.nickName);
						if (this.form.gender == "男"){
							uni.setStorageSync('sex',"man");
						}else if (this.form.gender == "女"){
							uni.setStorageSync('sex',"woman");
						}else if(this.form.gender == "保密"){
							uni.setStorageSync('sex',"question");
						}
						this.$u.toast(`修改成功`);
					}else{
						this.$u.toast(`修改失败`);
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content{
		margin: 20rpx 50rpx 80rpx 50rpx;
	}
</style>
