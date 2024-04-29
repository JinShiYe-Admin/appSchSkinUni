<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<scroll-view class="select-scroll" scroll-y="true" >
			<uni-list class="uni-list" :border="false">
				<checkbox-group >
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
						<view>
							<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
						</view>
						<view>{{item.text}}{{item.sno!=null&&item.sno.length>0?'（'+item.sno+'）':''}}</view>
					</label>
				</checkbox-group>
			</uni-list>
		</scroll-view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				stuList:[],
				personInfo: {},
				navItem: {},
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='选择学生'
			this.navItem = itemData;
			this.stuList=itemData.stuList
			console.log("itemData.stuList: " + JSON.stringify(itemData.stuList));
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
			userClick(user){
				user.checked=!user.checked
			},
			textClick(){
				let checkTec=[]
				const eventChannel = _this.getOpenerEventChannel()
				eventChannel.emit('refreshSetPeople', {data: _this.stuList});
				uni.navigateBack();
			},
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
