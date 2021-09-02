<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :text="navRightBtn" :textClick="navRightCallback"></mynavBar>
		<scroll-view class="select-scroll" scroll-y="true" >
			<uni-list class="uni-list" :border="false">
				<checkbox-group >
					<label  v-if="index!==0" class="uni-list-cell uni-list-cell-pd" v-for="(peopleModel,index) in peopleArray" :key="index" @click="selectPeople(peopleModel)">
						<view>
							<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="peopleModel.value"  :checked="peopleModel.checked" />
						</view>
						<view>{{peopleModel.user_name}}({{peopleModel.dpt_name}})</view>
					</label>
				</checkbox-group>
			</uni-list>
		</scroll-view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				navRightBtn:[],
				navRightCallback:[],
				needOrder:9,//
				orderArray:[],//当needOrder==1时，需要按选择的人顺序，塞入的人员数组
				defaltSelect:[],//从上个界面传过来的已选接收人
				peopleArray:[]//接口得到的接收人列表
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '选择接收人';
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			this.defaltSelect = this.itemData.selectPeople;
			this.needOrder = this.itemData.needOrder;
			if(this.needOrder == 0){
				this.navRightBtn = ['全选','反选','确定'];
				this.navRightCallback = [this.selectAll,this.returnSelectAll,this.sure];
			}else{
				this.navRightBtn = ['确定'];
				this.navRightCallback = [this.sure];
			}
			uni.setNavigationBarTitle({
				title: '选择接收人'
			});
			//#ifndef APP-PLUS
			document.title = "";
			//#endif
			this.getPeopleList();
		},
		methods: {
			sure() {
				console.log('sure');
				if (this.needOrder == 1) {
					if (this.orderArray.length==0) {
						this.showToast('请选择接收人');
					} else{
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshSetPeople', {data: this.orderArray});
						uni.navigateBack();
					}
				}else{
					var tempArray = [];
					for (var i = 0; i < this.peopleArray.length; i++) {
						var tempM = this.peopleArray[i];
						if (tempM.checked) {
							tempArray.push(tempM);
						}
					}
					console.log('选择的接收人列表:'+JSON.stringify(tempArray));
					if (tempArray.length==0) {
						this.showToast('请选择接收人');
					} else{
						tempArray = this.ArrayUnique(tempArray,'user_code');
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshSetPeople', {data: tempArray});
						uni.navigateBack();
					}
				}
			},
			selectAll(){
				console.log('selectAll');
				for (var i = 0; i < this.peopleArray.length; i++) {
					var tempM = this.peopleArray[i];
					tempM.checked = true;
				}
			},
			returnSelectAll(){
				console.log('returnSelectAll');
				for (var i = 0; i < this.peopleArray.length; i++) {
					var tempM = this.peopleArray[i];
					tempM.checked=!tempM.checked;
				}
			},
			selectPeople(model){
				if (!model.checked) {
					if (this.needOrder) {
						model.checked = true;
						this.orderArray.push(model);
					}else{
						for (var i = 0; i < this.peopleArray.length; i++) {
							var tempM = this.peopleArray[i];
							if (tempM.user_code == model.user_code) {
								tempM.checked = true;
							}
						}
					}
				} else{
					if (this.needOrder) {
						model.checked = false;
						for (var i = 0; i < this.orderArray.length; i++) {
							var tempM = this.orderArray[i];
							if (tempM.user_code == model.user_code&&tempM.dpt_code == model.dpt_code) {
								this.orderArray.splice(i,1);
							}
						}
					}else{
						for (var i = 0; i < this.peopleArray.length; i++) {
							var tempM = this.peopleArray[i];
							if (tempM.user_code == model.user_code) {
								tempM.checked = false;
							}
						}
					}
				}
			},
			// 获取接收人列表
			getPeopleList() {
				this.showLoading();
				var tempServ  = 0;
				if(this.itemData.serviced==0||this.itemData.serviced==1){
					tempServ = this.itemData.serviced;
				}else{
					tempServ = -1;
				}
				var comData = {
					serv_stat:tempServ,//
					unit_code: this.personInfo.unit_code, //
					index_code: this.itemData.access.split('#')[1] //
				}
				//获取接收人列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'dptUserOfApp', comData, (data0, data) => {
					if (data.code == 0) {
						try{
							// var tempCode = [];
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM = data.data.list[i];
								// tempCode.push(tempM.user_code);
								tempM.checked = false;
								for (var a = 0; a < this.defaltSelect.length; a++) {
									var tempM1 = this.defaltSelect[a];
									if (tempM.user_code == tempM1.user_code) {
										tempM.checked = true;
									}
								}
							}
							// var tempcodes = tempCode.join(',');
							// getUserInfo(data.data.list,this.itemData.access.split('#'));
							this.peopleArray = [].concat(data.data.list);
							this.hideLoading();
						}catch(e){
							this.hideLoading();
						}
					}else{
						this.hideLoading();
						this.showToast(data.msg);
					}
				});
			},
			//给数组去重
			ArrayUnique(array,key) {
				var arr = array;
				var n = [arr[0]];
				for(var i = 1; i < arr.length; i++) {
					if(key === undefined) {
						if(n.indexOf(arr[i]) == -1) n.push(arr[i]);
					} else {
						inner: {
							var has = false;
							for(var j = 0; j < n.length; j++) {
								if(arr[i][key] == n[j][key]) {
									has = true;
									break inner;
								}
							}
						}
						if(!has) {
							n.push(arr[i]);
						}
					}
				}
				return n;
			}
		}
	}
</script>

<style>
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
	.select-scroll{
		/* #ifdef APP-PLUS */
		height: calc(100vh - 80px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 45px);
		/* #endif */
	}
	.uni-list-cell {
		justify-content: flex-start
	}
</style>
