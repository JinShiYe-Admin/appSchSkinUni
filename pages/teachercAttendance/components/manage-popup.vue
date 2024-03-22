<template>
	<view>
		<uni-popup ref="popup" @change="change" type="bottom" background-color="#fff">
			<view class="popup-content">
				<view style="font-size: 16px;text-align: center;margin-bottom: 24px;">请选择需要提交的申请</view>
				<button type="default" @click="goApply(0)">补卡</button>
				<button type="default" @click="goApply(1)">出差</button>
				<button type="default" @click="goApply(2)">外出</button>
				<button type="default" @click="goApply(4)">请假</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	
	export default {
		name: "manage-popup",
		props: {
			open: {
				type: Boolean,
				default: false,
				require: true
			},
			index_code: {
				type: String,
				require: true
			}
		},
		data() {
			return {
				
			}
		},
		watch: {
			open(newOpen,oldOpen) {
				newOpen ? this.$refs.popup.open() : this.$refs.popup.close();
			}
		},
		methods: {
			change(e) {
				this.$emit('change', e.show);
			},
			goApply(type) {
				if(type>3) {
					util.openwithData('/pages/khfw/teaLeaveApply_add', {
						index_code: this.index_code,
					}, {
						refreshPage(data) { //子页面调用父页面需要的方法
							this.$refs.popup.close();
						}
					})
				}else{
					util.openwithData('/pages/teachercAttendance/ApplyAdd', {
						index_code: this.index_code,
						type,
					}, {
						refreshPage(data) { //子页面调用父页面需要的方法
							this.$refs.popup.close();
						}
					})
				}
				
			},
		}
	}
</script>

<style>
	.popup-content {
		padding: 24px 24px 60px;
		uni-button {
			font-size: 14px;
		}
		uni-button + uni-button {
			margin-top: 14px;
		}
	}
</style>