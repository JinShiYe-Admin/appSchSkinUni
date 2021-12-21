<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<uni-notice-bar :single="true" text="第二步:请选择考勤设备!" />
		<view>
			<uni-section v-if="location_type_1.length>0" title="教室" type="line"></uni-section>
			<view style="display: flex;flex-direction: row;flex-wrap: wrap;padding:0 15px;justify-content: space-between;">
				<view @click="setChecked(item)" :key="item.id" v-for="item in location_type_1" class="detail-text" :class="{'checked':item.checked}">{{item.attendance_location}}&ensp;{{tabBarItem.grd.text}}&ensp;{{tabBarItem.cls.text}}</view>
			</view>
		</view>
		<view>
			<uni-section v-if="location_type_2.length>0" title="宿舍" type="line"></uni-section>
		</view>
		<view>
			<uni-section v-if="location_type_3.length>0" title="室外" type="line"></uni-section>
		</view>
		<view>
			<uni-section v-if="location_type_4.length>0" title="其他" type="line"></uni-section>
		</view>
		<view class="line"></view>
		<view v-if="showNextButton">
			<button type="primary"  class="button-next" @click="nextStep">下一步</button>
		</view>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	 
	 
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				
				location_type_1:[],
				location_type_2:[],
				location_type_3:[],
				location_type_4:[],
				checked_equ:new Map(),//选中的定位型设备
				showNextButton:false,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='点名添加'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let that =this
			 itemData.locList.map(item=>{
				 item.checked=false
				 if(item.location_type==1){
					 console.log("item: " + JSON.stringify(item));
					that.location_type_1.push(item)
				 }
				 if(item.location_type==2){
				 	that.location_type_2.push(item)
				 }
				 if(item.location_type==3){
				 	that.location_type_3.push(item)
				 }
				 if(item.location_type==4){
				 	that.location_type_4.push(item)
				 }
			 })
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			setChecked(item){
				item.checked=!item.checked
				if(item.checked){
					this.checked_equ.set(item.id,item)
				}else{
					this.checked_equ.delete(item.id)
				}
				console.log(this.checked_equ);
				this.$forceUpdate();
			},
			getCls(grd_id){
				let comData={
					op_code:'add',
					grd_code:grd_id,
					get_cls:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let clss = response.cls_list;
					let clssList=[];
					clss.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.value;
						obj.text = currentValue.name;
						clssList.push(obj)
					})
					if(clssList.length>0 ){
						this.clsList=clssList;
					}else{
						this.showToast('获取班级为空');
					}
					this.hideLoading()
				})
			},
		},
	}
</script>

<style>
	::v-deep .uni-section{
		margin-top: 0;
	}
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
	.form-left-textarea{
		margin-top: 5px;
		align-self: flex-start;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	::v-deep .form-right .placeholder{
		color: grey;
		font-size: 14px;
		padding-right: 10px;
	}
	.uni-flex{
		align-items: center;
	}
	
	textarea{
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}
	
	.form-left-approve{
		margin: 5px 0;
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
	
	.button-next{
		background-color: #00CFBD;
		width: 35%;
		font-size: 14px;
		margin-top: 40px;
		animation: 1s opacity2 0s;
		-webkit-animation: 1s opacity2 0s;
		-moz-animation: 1s opacity2 0s;
	}
	
	@keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-webkit-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-moz-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	
	.title-text{
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.detail-text{
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: calc(50% - 5px);
		text-align: center;
		background: #dbdbdb;
		border: 1px solid #c2c2c2;
		color: #747474;
		font-size: 14px;
		margin: 3px 0;
		word-break: break-all;
	}
	.checked{
		background-color: #00a2e8;
		color: #feffff;
		border-color:#00a2e8;
	}
</style>
