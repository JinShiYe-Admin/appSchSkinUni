<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库物品</view>
			<input class="uni-input form-right" @click="addItem"  v-model="formData.itemCode"  placeholder="点击选择出库物品" disabled/>
		</view>
		<template v-if="formData.itemCode">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">物品信息</view>
				<uni-row style="flex: 1;text-align: right;">
					<uni-col :span="24"><view class="detail-text">{{this.getName()}}</view></uni-col>
					<uni-col :span="24"><view class="detail-text">{{this.getModel()}}</view></uni-col>
					<uni-col :span="24"><view class="detail-text">{{this.getMaxOkNum()}}</view></uni-col>
				</uni-row>
			</view>
		</template>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">领用人姓名</view>
			<input class="uni-input form-right"  v-model="formData.receiveManName"  placeholder="请输入" :disabled="canInput"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库数量</view>
			<input class="uni-input form-right" type="number" @blur="checkNum(formData.outNum)" v-model="formData.outNum"  :placeholder="formData.maxOkNumText" :disabled="canInput"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">放置地点</view>
			<input class="uni-input form-right"  v-model="formData.putArea"  placeholder="请输入" :disabled="canInput"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">备注</view>
			<textarea placeholder="请输入" v-model="formData.note" maxlength="100" :disabled="canInput"></textarea>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left" style="width: 300rpx;">设为红冲单</view>
			<switch class="form-right" :checked="formData.isRed" @change="changeAutoplay" color="#00CFBD"/>
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
				canSub:true,
				canInput:true,
				formData: {
					receiveManName:'',
					itemCode:'',
					itemType:'',
					itemProp:'',
					itemName:'',
					itemBrand:'',
					itemModel:'',
					outNum:'',
					putArea:'',
					isRed:false,
					note:'',
					maxOkNumText:'请输入出库数量',
					maxOkNum:0,
				}, //表单内容
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建手工出库'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			addItem(){//新增明细
				let that =this
				util.openwithData('/pages/schapp_item/item_add_query',{index_code:this.index_code,list:[{itemCode:this.formData.itemCode}],type:'ck'},{
					refreshItem(data){//子页面调用父页面需要的方法
						that.formData.itemCode=data.data.itemCode;
						that.formData.itemType=data.data.itemTypeCode;
						that.formData.itemProp=data.data.itemPropCode;
						that.formData.itemName=data.data.itemName;
						that.formData.itemBrand=data.data.itemBrand;
						that.formData.itemModel=data.data.itemModel;
						that.formData.maxOkNumText='最大可出库数量:'+data.data.okNum;
						that.formData.maxOkNum=data.data.okNum;
						that.formData.outNum=''
						that.canInput=false
					}
				})
			},
			getName:function(){
				return '名称:'+(this.formData.itemName?this.formData.itemName:'暂无')
			},
			getModel:function(){
				return '型号:'+(this.formData.itemModel?this.formData.itemModel:'暂无')
			},
			getMaxOkNum:function(){
				return '最大可出库数量:'+this.formData.maxOkNum
			},
			checkNum:function(outNum){ 
				let isRed=this.formData.isRed
				if(outNum==0){
					this.showToast('无效值，请重新输入')
					this.formData.outNum=1
				}
				if(outNum==''){
					this.showToast('无效值，请重新输入')
					this.formData.outNum=1
					
				}
				
				if(outNum>this.formData.maxOkNum){
					this.showToast('超出最大库存数量')
					this.formData.outNum=this.formData.maxOkNum
				}
				
				if(isRed==false && outNum<0){
					this.showToast('当前为非红冲单，数量不可为负')
					this.formData.outNum=1
				}//红冲单可以为负数
			},
			textClick(){//发送请假信息
				let formData=this.formData;
				console.log("formData: " + JSON.stringify(formData));
				if(formData.itemCode=='' ||formData.itemType=='' ||formData.itemProp=='' 
				||formData.itemName=='' ||formData.itemBrand=='' ||formData.itemModel=='' ){
					this.showToast('请先选择出库物品')
				}else if(formData.receiveManName==''){
					this.showToast('请输入领用人姓名')
				}else if(formData.outNum>formData.maxOkNum){
					this.showToast('超出最大可出库数量'+formData.maxOkNum)
				}else if(formData.putArea==''){
					this.showToast('请输入放置地点')
				}else if(formData.note==''){
					this.showToast('请输入备注')
				}else{
					if(this.canSub){
						this.canSub=false
						this.submitData();
					}
				}
			},
			submitData(){
				this.showLoading()
				let comData={
					receiveManName:this.formData.receiveManName,
					outManCode:this.personInfo.user_code,
					outManName:this.personInfo.user_name,
					itemCode:this.formData.itemCode,
					itemType:this.formData.itemType,
					itemProp:this.formData.itemProp,
					itemName:this.formData.itemName,
					itemBrand:this.formData.itemBrand,
					itemModel:this.formData.itemModel,
					outNum:this.formData.outNum*1,
					putArea:this.formData.putArea,
					isRed:this.formData.isRed?1:0,
					note:this.formData.note.replace(/\n/g,'<br>'),
					op_code:'add',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'handOut/addHandOut ',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshByAdd', {data: 1});
				     	 uni.navigateBack();
				     } else {
				     	this.canSub=true
				     	this.hideLoading()
				     	this.showToast(response.msg);
				     }
				},()=>{
						this.canSub=true
				})
			},
			changeAutoplay(){
				this.formData.isRed = !this.formData.isRed
				if(this.formData.isRed==false && this.formData.outNum<0){
					this.showToast('当前为非红冲单，数量不可为负')
					this.formData.outNum=1
				} 
			},
		},
	}
</script>

<style>
	.uni-input-placeholder{
		font-size: 12px;
		color: #939393;
	}
	.item-input{
		margin-top: 8px;
		border: 1px solid #e5e5e5 !important;
		border-radius: 7px;
		padding: 8px 5px ;
	}
	.detail-text{
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
			word-break: break-all;
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
	
	.add-button{
		margin: 10px 15px 0;
		background: #00CFBD;
		border-color: #00CFBD;
		font-size: 16px;
	}
</style>
