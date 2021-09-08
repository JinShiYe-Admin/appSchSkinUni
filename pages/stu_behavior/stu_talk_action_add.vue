<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">行为详情</view>
			<view class="form-right">
				<view style="margin: 5px 0;">{{tabBarItem.grd_name}}&ensp;{{tabBarItem.class_name}}&ensp;{{tabBarItem.stu_name}}</view>
				<view style="margin: 5px 0;">{{tabBarItem.behavior_time}}&ensp;&ensp;{{tabBarItem.item_txt}}</view>
				<view style="margin: 5px 0;">{{tabBarItem.comment}}</view>
			</view>
		</view>
		<template v-if="imgListf.length>0">
			<view v-for="(extraFile,index) in imgListf" :key='index'>
				<view class="encName">附件:
					<!-- #ifdef APP-PLUS -->
						<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;" @click="checkEnc(extraFile)">附件{{index+1}}</a>
					<!-- #endif -->
					<!-- #ifdef H5 -->
						<uni-link :href="extraFile" style="margin-left: 10px;" :text="'附件'+(index+1)"></uni-link>
					<!-- #endif -->
				</view>
			</view>
		</template>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">谈话日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formData.time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<!-- <xp-picker mode="ymd" ref="timePicker" history :animation="false" :year-range='[2020,2030]' @confirm="timeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.time" placeholder="请选择" disabled @click="timePicker"/> -->
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">谈话记录</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" :disabled="!edit"></textarea>
		</view>
		<template v-if="edit">
			<view class="double-line"></view>
			<view class="uni-flex uni-row form-view choose-file">
				<view class="choose-file-text">附件<view class="file-des">{{`(最多可选择${this.showMaxCount}张照片${this.wxTips?this.wxTips:''})`}}</view></view>
				<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount"></g-upload>
			</view>
		</template>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	 import gUpload from "@/components/g-upload/g-upload.vue"
	 import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	 
	 
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				
				
				canSub:true,
				edit:false,
				formData: {
					id:'',
					time:'',//发生日期
					comment:'',//说明
				}, //表单内容
				imgListf:[],
				
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				
				// 附件上传相关👇
				control:true,//是否显示上传 + 按钮 一般用于显示
				deleteBtn:true,//是否显示删除 按钮 一般用于显示
				
				maxCount:9,//单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount:9,//单次上传最大数量
				
				columnNum:3,//每行显示的图片数量
				imgNames: [],//服务器回传的图片名称
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles:[],//选择的文件对象，用于上传时获取文件名  不需要改动
				// #ifdef H5
					wxTips:',微信端不支持多选',//如果是H5，需要提示该内容
				// #endif
				// #ifndef H5
					wxTips:'',
				// #endif
			}
		},
		components: {
			mynavBar,
			 gUpload
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建行为谈话'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			 this.formData.id=itemData.id
			 this.edit=itemData.edit==1
			let imgListf=[]
			itemData.behavior_asset_ids.map(item=>{
				imgListf.push(item.url)
			})
			this.imgListf=imgListf
			if(itemData.canDelete){
				this.icon='trash'
			}
			let that=this
			setTimeout(()=>{
				if(itemData.status=='unTalk'){
					that.showLoading();
					that.setRead();//已阅操作是根据item的add==1判断的，在列表页已经判断过
				}
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			textClick(){//发送请假信息
				if(this.formData.time==''){
					this.showToast('请选择谈话日期')
				}else if(this.formData.comment==''){
					this.showToast('请输入谈话记录')
				}else{
					if(this.canSub){
						this.canSub=false
						this.upLoadImg();
					}
				}
			},
			//附件上传相关👇
			chooseFile(list, v,f) {
			  // console.log("上传图片_list：", list)
			  // console.log("上传图片_v：", v);
			  //  console.log("上传图片_f：", f);
			  this.imgList=list
			  this.imgFiles=this.imgFiles.concat(f)
			  this.maxCount=this.showMaxCount-list.length
			},
			imgDelete(list, eq,fileeq) {
			  // console.log("删除图片_list：", list)
			  // console.log("删除图片_eq：", eq)
			  // console.log("删除图片_fileeq：", fileeq)
			  this.imgList=list
			  this.imgFiles.splice(fileeq, 1); //删除临时路径
			  this.imgNames.splice(eq, 1); //删除文件名
			  this.maxCount=this.showMaxCount-list.length
			  // console.log("删除图片_fileeq：", this.imgFiles)
			},
			upLoadImg(){
				let _this=this
				let names=[]
				this.showLoading('正在上传文件...')
				cloudFileUtil.uploadFiles(this,'1',this.imgList,this.QN_PB_NAME,this.QN_XSXW_XSTH,(encName,encAddrStr)=>{
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName,encAddrStr)
				})
			},
			//附件上传相关👆
			submitData(encNameStr,encAddrStr){
				this.showLoading()
				let asset_ids=[]
				if(encNameStr){
					encNameStr.map(function(item,index){
						let obj={}
						obj.id=''
						obj.url=encAddrStr[index]
						obj.ext=item.split(".")[1]
						obj.name='附件'+(index+1)
						asset_ids.push(obj)
					})
				}
				let comData={
					grd_code: this.tabBarItem.grd_code,
					cls_code: this.tabBarItem.cls_code,
					student_behavior_id: this.tabBarItem.student_behavior_id,
					id:''+this.formData.id,
					chat_detail: this.formData.comment,
					chat_time: this.formData.time,
					asset_ids:asset_ids,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'Talk/editSave',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshTalkBehaviorDetail', {data: 1});
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
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.formData.time=e 
			},
			setRead(){
				let comData={
					grd_code: this.tabBarItem.grd_code,
					cls_code: this.tabBarItem.cls_code,
					student_behavior_id: this.tabBarItem.student_behavior_id,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'Talk/read',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					 this.edit=response.edit==1
					 this.formData.id=response.id
					 let model={
						 id:response.id,
						 edit:response.edit,
						 bid:this.tabBarItem.student_behavior_id,
						 create_user_name:response.create_user_name,
					 }
					 const eventChannel = this.getOpenerEventChannel()
					 eventChannel.emit('refreshTalkDetailZt', model);
					 this.hideLoading()
				})
			}
		},
	}
</script>

<style>
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
	.encName {
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}
</style>
