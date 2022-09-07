<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-grid :column="3" :showBorder='false' :square="false" :highlight="false" style='margin-top: 20px;'>
			<uni-grid-item v-for="(item, index) in stuList" :index="index" :key="index">
				<view class="grid-item-box" @click="clickStu(item)">
					<image src="https://www.108800.com/user.jpg" class="moreImg" mode="aspectFill" :style="{border:(item.stu_code==stuModel.stu_code?'1px solid #00CFBD':'')}" />
					<view style="margin-top: 5px;font-size: 13px;text-align: center;" :style="{color:(item.stu_code==stuModel.stu_code?'#00CFBD':'#878787')}">{{item.stu_name}}</view>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				index_code: '',
				stuList:[],
				stuModel:{},
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.navItem.text = '切换学生';
			this.navItem.name = '切换学生';
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1];
			this.stuModel = this.navItem.stuModel;
			//#ifdef H5
			document.title = "";
			//#endif
			// 获取学生列表
			this.getStuList();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickStu(model){
				if (model.stu_code != this.stuModel.stu_code) {
					const eventChannel = _this.getOpenerEventChannel()
					eventChannel.emit('refreshChangeStu', {data: model});
					uni.navigateBack();
				}
			},
			// 获取学生列表
			getStuList() {
				var comData = {
					index_code: 'index',
					par_code: this.personInfo.user_code //
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_HR_SUB + 'stu/getStuInfoByParCode2Phone', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.stuList = data.data.list;
						// if (this.stuList.length>0) {
						// 	this.stuModel = this.stuList[0];
						// }
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.grid-item-box{
		margin: 10px;
	}
	.moreImg {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-left: calc((100% - 60px)/2);
	}
	.nowStu{
		border: 1px solid red;
	}
</style>
