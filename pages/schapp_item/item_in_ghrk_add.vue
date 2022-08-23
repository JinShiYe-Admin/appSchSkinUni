<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">入库物品</view>
			<input class="uni-input form-right" @click="addItem"  v-model="formData.itemCode"  placeholder="点击选择入库物品" disabled/>
		</view>
		<template v-if="formData.itemCode">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">物品信息</view>
				<uni-row style="flex: 1;text-align: right;">
					<uni-col :span="24"><view class="detail-text">{{this.getName()}}</view></uni-col>
					<uni-col :span="24"><view class="detail-text">{{this.getModel()}}</view></uni-col>
				</uni-row>
			</view>
		</template>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">归还人姓名</view>
			<input class="uni-input form-right"  v-model="formData.returnManName" maxlength="20"   placeholder="请输入" :disabled="canInput"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">入库数量</view>
			<input class="uni-input form-right" type="number" @blur="checkNum(formData.inNum)" v-model="formData.inNum"  placeholder="请输入" :disabled="canInput"/>
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
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left" style="width: 300rpx;">设为报损归还</view>
			<switch class="form-right" :checked="formData.inType" @change="changeInType" color="#00CFBD"/>
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
				index_code:'',
				personInfo: {},
				navItem: {},
				canSub:true,
				canInput:true,
				formData: {
					returnManName:'',
					itemCode:'',
					itemType:'',
					itemProp:'',
					itemName:'',
					itemBrand:'',
					itemModel:'',
					inNum:'',
					isRed:false,
					inType:false,
					note:'',
				}, //表单内容
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建归还入库'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			addItem(){//新增明细
				let that =this
				util.openwithData('/pages/schapp_item/item_add_query',{index_code:this.index_code,list:[{itemCode:this.formData.itemCode}],type:'rk'},{
					refreshItem(data){//子页面调用父页面需要的方法
						that.formData.itemCode=data.data.itemCode;
						that.formData.itemType=data.data.itemTypeCode;
						that.formData.itemProp=data.data.itemPropCode;
						that.formData.itemName=data.data.itemName;
						that.formData.itemBrand=data.data.itemBrand;
						that.formData.itemModel=data.data.itemModel;
						that.formData.inNum=''
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
			checkNum:function(inNum){ 
				let isRed=this.formData.isRed
				if(inNum==0){
					this.showToast('无效值，请重新输入')
					this.formData.inNum=1
				}
				if(inNum==''){
					this.showToast('无效值，请重新输入')
					this.formData.inNum=1
					
				}
				
				if(inNum>10000){
					this.showToast('超出数量范围限制')
					this.formData.inNum=10000
				}
				
				if(isRed==false && inNum<0){
					this.showToast('当前为非红冲单，数量不可为负')
					this.formData.inNum=1
				}else{}//红冲单可以为负数
				
				if(inNum<-10000){
					this.showToast('超出数量范围限制')
					this.formData.inNum=-10000
				}
			},
			textClick(){//发送请假信息
				let formData=_this.formData;
				console.log("formData: " + JSON.stringify(formData));
				if(formData.itemCode=='' ||formData.itemType=='' ||formData.itemProp=='' 
				||formData.itemName=='' ||formData.itemBrand=='' ||formData.itemModel=='' ){
					_this.showToast('请先选择入库物品')
				}else if(formData.returnManName==''){
					_this.showToast('请输入归还人姓名')
				}else if(formData.inNum==''){
					_this.showToast('请输入入库数量')
				}else if(formData.note==''){
					_this.showToast('请输入备注')
				}else{
					if(_this.canSub){
						_this.canSub=false
						_this.submitData();
					}
				}
			},
			submitData(){
				this.showLoading()
				let comData={
					returnManName: this.formData.returnManName,
					inManCode:this.personInfo.user_code,
					inManName:this.personInfo.user_name,
					itemCode:this.formData.itemCode,
					itemType:this.formData.itemType,
					itemProp:this.formData.itemProp,
					itemName:this.formData.itemName,
					itemBrand:this.formData.itemBrand,
					itemModel:this.formData.itemModel,
					inNum:this.formData.inNum*1,
					isRed:this.formData.isRed?1:0,
					inType:this.formData.inType?2:1,
					note:this.formData.note.replace(/\n/g,'<br>'),
					op_code:'add',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'returnIn/addReturnIn',comData,(response0,response)=>{
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
				if(this.formData.isRed==false && this.formData.inNum<0){
					this.showToast('当前为非红冲单，数量不可为负')
					this.formData.inNum=1
				} 
			},
			changeInType(){
				this.formData.inType = !this.formData.inType
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
