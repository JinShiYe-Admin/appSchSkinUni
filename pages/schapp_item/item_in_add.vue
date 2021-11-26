<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">采购人姓名</view>
			<input class="uni-input form-right"  v-model="formData.purchasingManName" maxlength="20"  placeholder="请输入"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">供应商</view>
			<input class="uni-input form-right"  v-model="formData.supplierName" maxlength="20"  placeholder="请输入"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">说明</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left" style="width: 300rpx;">设为红冲单</view>
			<switch class="form-right" :checked="formData.isRed" @change="changeAutoplay" color="#00CFBD"/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left" style="width: 300rpx;">明细</view>
		</view>
		<template>
			<view :key="index" class="uni-flex uni-row form-view" v-for="(item,index) in formData.list">
				<view style="display: flex;flex-direction: column;">
					<view style="display: flex;align-items: center;">
						<uni-row style="flex: 1;">
							<uni-col :span="12"><view class="detail-text">名称:{{item.itemName}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">型号:{{item.itemType}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">
								<input class="uni-input item-input" type="number"  @blur="checkNum(index,formData.list[index].inNum)" style="margin-right: 15px;" v-model="formData.list[index].inNum"  placeholder="入库数量"/>
							</view></uni-col>
							<uni-col :span="12"><view class="detail-text">
								<input class="uni-input item-input" type="number"  @blur="checkPrice(index,formData.list[index].inPrice)" v-model="formData.list[index].inPrice"  placeholder="入库单价"/>
							</view></uni-col>
						</uni-row>
						<uni-icons @click="deleteItem(index)" type="close" color="#f74c31" size="18" style="width: 30px;"></uni-icons>
					</view>
					<view class="line"></view>
				</view>
			</view>
			
		</template>
		<button type="primary" class="add-button" @click="addItem"><uni-icons type="plusempty" color="#FFFFFF" size="15"></uni-icons>&ensp;新增明细</button>
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
				formData: {
					purchasingManName:'',//采购人
					supplierName:'',//供应商
					comment:'',//说明
					isRed:false,//红冲单
					list:[]
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
			itemData.text='新建采购入库'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
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
			addItem(){//新增明细
				let that =this
				util.openwithData('/pages/schapp_item/item_add_query',{index_code:this.index_code,list:this.formData.list,type:'rk'},{
					refreshItem(data){//子页面调用父页面需要的方法
						let obj={
							itemCode:data.data.itemCode,
							itemType:data.data.itemTypeCode,
							itemProp:data.data.itemPropCode,
							itemName:data.data.itemName,
							itemBrand:data.data.itemBrand,
							itemModel:data.data.itemModel,
							inNum:'',
							inPrice:'',
						}
						let list =that.formData.list
						that.formData.list=list.concat([obj])
					}
				})
			},
			deleteItem(index){
				let list =[].concat(this.formData.list);
				list.splice(index,1)
				this.formData.list=list;
				this.$forceUpdate()
			},
			checkNum:function(index,inNum){
				let isRed=this.formData.isRed
				console.log(isRed)
				if(inNum==0){
					this.showToast('无效值，请重新输入')
					this.formData.list[index].inNum=1
				}
				console.log(inNum)
				if(inNum==''){
					this.showToast('无效值，请重新输入')
					this.formData.list[index].inNum=1
				}
				
				if(inNum>10000){
					this.showToast('超出数量范围限制')
					this.formData.list[index].inNum=10000
				}
				
				if(isRed==false && inNum<0){
					this.showToast('当前为非红冲单，数量不可为负')
					this.formData.list[index].inNum=1
				}else{}//红冲单可以为负数
				
				if(inNum<-10000){
					this.showToast('超出数量范围限制')
					this.formData.list[index].inNum=-10000
				}
			},
			checkPrice:function(index,inPrice){
				console.log(inPrice)
				if(inPrice==0){
					this.showToast('无效值，请重新输入')
					this.formData.list[index].inPrice=''
				}
				if(inPrice>1000000 || inPrice<0){
					this.showToast('超出单价范围限制')
					this.formData.list[index].inPrice=''
				}
			},
			textClick(){//发送请假信息
				if(this.formData.purchasingManName==''){
					this.showToast('请输入采购人')
				}else if(this.formData.supplierName==''){
					this.showToast('请输入供应商')
				}else if(this.formData.list.length==0){
					this.showToast('请至少保留一条物品明细')
				}else{
					let list=this.formData.list
					let error=false
					list.map(function(item){
						console.log(item.inNum);
						console.log(item.inPrice);
						if(item.inNum&&item.inPrice){
							item.inNum=item.inNum*1
							item.inPrice=item.inPrice*1
						}else{
							error=true;
						}
					})
					if(error){
						this.showToast('请维护物品明细的数量和价格')
					}else{
						if(this.canSub){
							this.canSub=false
							this.submitData();
						}
					}
				}
			},
			submitData(){
				this.showLoading()
				let comData={
					purchasingManName: this.formData.purchasingManName,
					supplierName:this.formData.supplierName,
					inManCode:this.personInfo.user_code,
					inManName: this.personInfo.user_name,
					isRed:this.formData.isRed?1:0,
					note: this.formData.comment.replace(/\n/g,'<br>'),
					list: this.formData.list,
					op_code:'add',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'purchasingIn/addPurchasingIn ',comData,(response0,response)=>{
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
