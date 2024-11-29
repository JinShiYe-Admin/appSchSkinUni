<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存" :textClick="textClick"></mynavBar>
		<view v-if="pageFlag==1" class="settingCss">
			<view class="flexStart pbView">
				<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
				<view class="pb1">荣誉称号：</view>
			</view>
			<uni-easyinput class="input1" v-model="pageModel.name" :clearable='false' placeholder="请输入荣誉称号" maxlength="10"></uni-easyinput>
			<view class="flexStart pbView">
				<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
				<view class="pb1">表彰周期：</view>
			</view>
			<view class="flexStart pbView">
				<view class="btn0" :class="pageModel.cycle_type=='weeks'?'btn1':''" @click="clickType('weeks')">按周</view>
				<view class="btn0" :class="pageModel.cycle_type=='weeks'?'':'btn1'" @click="clickType('months')">按月</view>
			</view>
			<view class="flexStart pbView">
				<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
				<view class="pb1">获得荣誉的判定方式：</view>
			</view>
			<view class="flexStart pbView">
				<view class="btn0" :class="pageModel.judgment.type=='order'?'btn1':''" @click="clickJud('order')">按班级量化得分排名判定</view>
			</view>
			<view class="flexStart scoreCss">
				<view class="selectType">
				    <uni-data-select
				      v-model="pageModel.judgment.order.type"
				      :localdata="range" :clear="false"
				      @change="change"
				    ></uni-data-select>
				  </view>
				第
				<view class="input2">
					<uni-easyinput v-model="pageModel.judgment.order.min_order" :disabled="pageModel.judgment.type=='order'?false:true" trim="all" :clearable='false' type="number" maxlength="4"></uni-easyinput>
				</view>
				名至第
				<view class="input2">
					<uni-easyinput v-model="pageModel.judgment.order.max_order" :disabled="pageModel.judgment.type=='order'?false:true" trim="all" :clearable='false' type="number" maxlength="4"></uni-easyinput>
				</view>名
			</view>
			<view class="flexStart pbView">
				<view class="btn0" :class="pageModel.judgment.type=='order'?'':'btn1'" @click="clickJud('score')">按班级量化得分大小判定</view>
			</view>
			<view class="flexStart scoreCss">
				大于等于
				<view class="input2">
					<uni-easyinput v-model="pageModel.judgment.score.min_score" :disabled="pageModel.judgment.type=='order'?true:false" trim="all" :clearable='false' type="number" maxlength="4"></uni-easyinput>
				</view>
				，小于等于
				<view class="input2">
					<uni-easyinput v-model="pageModel.judgment.score.max_score" :disabled="pageModel.judgment.type=='order'?true:false" trim="all" :clearable='false' type="number" maxlength="4"></uni-easyinput>
				</view>
			</view>
			
			<view class="flexStart pbView" style="margin-top: 100px;">
				<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
				<view class="pb1">说明：系统将在当前表彰周期最后一天23:59自动发布获得荣誉称号的班级名单。</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pageFlag:0,
				range: [
				    { value: 'grd', text: "年级" },
				    { value: 'sch', text: "全校" },
				],
				pageModel:{}
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			// console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = '荣誉表彰设置';
			this.index_code = this.navItem.index_code;
			// console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getSetting()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			change(e) {
				this.pageModel.judgment.order.type = e
			},
			clickType(type){
				this.pageModel.cycle_type = type
			},
			clickJud(type){
				this.pageModel.judgment.type = type
			},
			textClick(){
				// console.log('textClick:'+JSON.stringify(this.pageModel))
				if (this.pageModel.name.length==0) {
					this.showToast('请输入荣誉称号');
					return
				}
				if (this.pageModel.judgment.type=='order'&&parseInt(this.pageModel.judgment.order.max_order)<=parseInt(this.pageModel.judgment.order.min_order)) {
					this.showToast('请输入正确的排名');
					return
				}
				if (this.pageModel.judgment.type!='order'&&parseInt(this.pageModel.judgment.score.max_score)<=parseInt(this.pageModel.judgment.score.min_score)) {
					this.showToast('请输入正确的量化得分');
					return
				}
				// 7.2.保存设置
				// let comData = {
				// 	index_code: this.index_code,
				// }
				this.pageModel.index_code = this.index_code
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'honorSetting/save', this.pageModel, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshRybzIndex');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getSetting(){
				// 7.1.获取学校设置
				let comData = {
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'honorSetting/schSetting', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.pageFlag = 1
						data0.setting.judgment.order.min_order = data0.setting.judgment.order.min_order.toString()
						data0.setting.judgment.order.max_order = data0.setting.judgment.order.max_order.toString()
						this.pageModel = data0.setting
					} else {
						this.showToast(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.settingCss{
		margin: 20px;
	}
	.pbView{
		margin: 10px 0;
		.pbXing{
			margin: 5px 5px 0 0px;
		}
		.pb1{
			font-size: 14px;
			color: #000;
		}
		.btn0{
			font-size: 14px;
			color: #7f7f7f;
			background: #f2f2f2;
			text-align: center;
			/* width: 80px; */
			padding: 0 30px;
			height: 33px;
			line-height: 33px;
			border-radius: 5px;
			margin-right: 10px;
		}
		.btn1{
			color: #ffffff;
			background: #169bd5;
		}
	}
	.scoreCss{
		font-size: 14px;
		color: #333;
		margin-top: 20px;
		
		.selectType{
			margin: -8px 10px 5px 0px;
			width: 70px;
		}
		.input2{
			margin: -8px 10px 5px 10px;
			width: 60px;
		}
	}
	.scoreCss1{
		color: #aaaaaa;
	}
</style>
