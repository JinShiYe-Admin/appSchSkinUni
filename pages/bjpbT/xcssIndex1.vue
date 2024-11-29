<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="下一步" :textClick="textClick"></mynavBar>
		<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">一级分类：</view>
		<view style="margin: 5px 0 5px 10px;">
			<uni-grid :column="2">
				<uni-grid-item v-for="(item, index) in houseArray" :key="index" style="height: 50px;">
					<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='houseSelect(item, index)'
						:style="index==houseIndex?'background-color: #2c96bd;color: #ffffff;':''">
						{{item.name}}
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view v-if="floorArray.length>0" style="margin-left: 15px;font-size: 14px;color: 7f7f7f;">二级分类：</view>
		<view v-if="floorArray.length>0" style="margin: 5px 10px;">
			<uni-grid :column="1">
				<uni-grid-item v-for="(item, index) in floorArray" :key="index" style="height: 40px;">
					<view class="grid-item-box gridBox" @click='floorSelect(item, index)'
						:style="item.selectFlag==1?'background-color: #2c96bd;color: #ffffff;':''">
						{{item.name}}
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">评比项：</view>
		<view style="margin: 5px 10px;">
			<uni-grid :column="1">
				<uni-grid-item v-for="(item, index) in roomArray" :key="index" style="height: auto;">
					<view class="grid-item-box gridBoxRoom" @click='roomSelect(item, index)'
						:style="item.selectFlag==1?'background-color: #2c96bd;color: #ffffff;':''">
						{{item.name}}
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				houseArray:[],
				houseIndex:0,
				floorArray:[],
				roomArray:[],
				dataFlag:0,//一级分类下，只有二级分类1，只有3级分类2，2级3级混合3
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = this.navItem.fromName;
			this.index_code = this.navItem.index_code;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			if (this.navItem.from == 0) {//巡查宿舍
				this.getRoomList()
			} else{//巡查班级
				this.getClsList()
			}
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			getRoomList(){
				// 3.1.评比项目树形结构
				let comData = {
					type:2,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpItem/tree', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.houseArray = data0.list
						this.houseIndex = 0
						this.setFirstLevel()
					} else {
						this.showToast(data.msg);
					}
				})
			},
			setFirstLevel(){
				this.floorArray = []
				this.roomArray = []
				for (var i = 0; i < this.houseArray[this.houseIndex].children.length; i++) {
					let tempA = this.houseArray[this.houseIndex].children[i]
					if (tempA.level == 2) {
						this.floorArray.push(tempA)
					} else{
						this.roomArray.push(tempA)
					}
				}
				if (this.floorArray.length>0&&this.roomArray.length==0) {//只有2级分类
					this.dataFlag = 1
					for (var i = 0; i < this.floorArray.length; i++) {
						let tempM = this.floorArray[i]
						tempM.selectFlag = 0
						if (i == 0) {
							tempM.selectFlag = 1
							this.roomArray = tempM.children
							for (var a = 0; a < this.roomArray.length; a++) {
								this.roomArray[a].selectFlag = 0
							}
						}
					}
				} else if (this.floorArray.length==0&&this.roomArray.length>0) {//只有3级分类
					this.dataFlag = 2
					for (var a = 0; a < this.roomArray.length; a++) {
						this.roomArray[a].selectFlag = 0
					}
				} else{//混合
					this.dataFlag = 3
					for (var i = 0; i < this.floorArray.length; i++) {
						let tempM = this.floorArray[i]
						tempM.selectFlag = 0
					}
					for (var a = 0; a < this.roomArray.length; a++) {
						this.roomArray[a].selectFlag = 0
					}
				}
			},
			houseSelect(item, index){
				if (this.houseIndex != index) {
					this.houseIndex = index
					this.setFirstLevel()
				}
			},
			floorSelect(item, index){
				if (item.selectFlag == 0) {
					for (var i = 0; i < this.floorArray.length; i++) {
						let tempM = this.floorArray[i]
						if (tempM.id == item.id) {
							tempM.selectFlag = 1
							this.roomArray = tempM.children
							for (var a = 0; a < this.roomArray.length; a++) {
								this.roomArray[a].selectFlag = 0
							}
						} else{
							tempM.selectFlag = 0
						}
					}
				} else {
					for (var i = 0; i < this.floorArray.length; i++) {
						let tempM = this.floorArray[i]
						if (tempM.id == item.id) {
							if (this.dataFlag == 1) {//只有二级
								
							} else{//混合
								tempM.selectFlag = 0
								this.floorArray = JSON.parse(JSON.stringify(this.floorArray))
								let tempArray = []
								for (var i = 0; i < this.houseArray[this.houseIndex].children.length; i++) {
									let tempA = this.houseArray[this.houseIndex].children[i]
									if (tempA.level == 3) {
										tempA.selectFlag = 0
										tempArray.push(tempA)
									}
								}
								this.roomArray = tempArray
							}
						}
					}
				}
				// if (this.dataFlag == 1) {//只有二级
					
				// } else{//混合
					
				// }
			},
			roomSelect(item, index){
				if (item.selectFlag == 0) {
					item.selectFlag = 1
				} else{
					item.selectFlag = 0
				}
				// for (var a = 0; a < this.roomArray.length; a++) {
				// 	let tempM = this.roomArray[a]
				// 	if (tempM.id == item.id) {
				// 		if (tempM.selectFlag == 0) {
				// 			tempM.selectFlag = 1
				// 		} else{
				// 			tempM.selectFlag = 0
				// 		}
				// 	}
				// }
				this.roomArray = JSON.parse(JSON.stringify(this.roomArray))
			},
			getClsList() { //5.5.巡查班级-获取可选项目
				let comData = {
					user_code: this.personInfo.user_code,
					date: this.navItem.date,
					grd_code:this.navItem.grdCode,
					cls_code:this.navItem.clsCode,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/getClsItem', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.houseArray = data0.list
						this.houseIndex = 0
						this.setFirstLevel()
					} else {
						this.showToast(data.msg);
					}
				})
			},
			textClick(){
				// 判断是否选择评比项
				let tempA = []
				for (var i = 0; i < this.roomArray.length; i++) {
					let tempM = this.roomArray[i]
					if (tempM.selectFlag == 1) {
						tempA.push(tempM)
					}
				}
				if (tempA.length>0) {
					this.navItem.dormModel = this.houseArray[this.houseIndex]
					this.navItem.floorFlag = 0
					for (var i = 0; i < this.floorArray.length; i++) {
						if (this.floorArray[i].selectFlag == 1) {
							this.navItem.floorFlag = 1
							this.navItem.floorModel = this.floorArray[i]
						}
					}
					this.navItem.roomArray = tempA
					util.openwithData('/pages/bjpbT/xcssIndex2',this.navItem);
				}else{
					this.showToast('请先选择评比项');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}

	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.gridBoxRoom{
		/* height: 40px; */
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px;
		margin: 5px;
		border-radius: 3px;
		color: #000000;
		font-size: 14px;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold; */
	}

	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}
</style>
