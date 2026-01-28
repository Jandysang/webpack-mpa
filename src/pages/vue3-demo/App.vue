<template>
  <view class="menu-bg"></view>

  <view class="pageinner">
    <!-- start 自定义顶部栏 -->
    <view class="top-box" :style="{ height: data.navBarHeight * 2 + 'rpx' }">
      <image class="head-img" :style="{ height: data.headImgHeight + 'rpx' }" :src="imgCDN + '/2.0/theme_bg.png'">
      </image>
      <view class="nav-bar">
        <view class='picker hotelpick' @tap="toSwitchHotelPage">
          <view class='pick_viewer'>
            <image :src='data.hotelLogo' class='icon-hotel'></image>
            <view class="hotel-name">{{ data.hotelName }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- end 自定义顶部栏 -->

    <!-- start 内容主体区域 -->
    <scroll-view scroll-y="true" :refresher-enabled="true" @refresherrefresh="refresherrefresh"
      :refresher-triggered="isTriggered" :scroll-top="scrollTop" scroll-with-animation="true" class="scroll-box">
      <view class="scroll-head" :style="{ height: data.headImgHeight - 2 * data.navBarHeight + 'rpx' }">
        <image class="head-img" :style="{ height: data.headImgHeight + 'rpx' }" :src="imgCDN + '/2.0/theme_bg.png'">
        </image>
      </view>

      <view class="scroll-con">
        <view class="welcome">{{ data.userName ? data.userName + '您好，欢迎您的入住' : '您好，欢迎入住' }}</view>

        <!-- 1、无预订单无在住单 s -->
        <view class="content-norder" v-if="data.situationType == 1">
          <!-- 1-1、标题栏 s -->
          <view class="bigtitle noorder">
            <image class="bigtitle_trangle" :src="imgCDN + '/2.0/trangle_left.png'"></image>
            <image class="bigtitle_img" :src="imgCDN + '/2.0/title_noOrder.png'"></image>
            <image class="bigtitle_trangle" :src="imgCDN + '/2.0/trangle_right.png'"></image>
          </view>
          <!-- 1-1、标题栏 e -->

          <!-- 1-2、查询表单 s -->
          <form class="cardsec cardsec_form" @submit="handleSearchClick">
            <view class="label">为您查询 <text class="label_theme">[{{ _VFilterUtil._formatDateCn(data.today, true, true)
                }}]</text> 可入住的订单</view>
            <input type="text" class="searchinput" name="keywords" placeholder="请输入预订人姓名/预订单号"
              placeholder-class="input_placeholder" v-model="data.searchKeywords" />
            <button class="button_primary" form-type="submit" :loading="data.loading">有预订，查询订单</button>

            <view class="channel_box">
              <image class="channel_img_all" :src="imgCDN + '/2.0/channel.png'"></image>
              <view class="channel_tip">
                <text class="channel_tip_text">支持但不限于查询以上渠道的预订单</text>
              </view>
            </view>
          </form>
          <!-- 1-2、查询表单 e -->

          <!-- 1-3、菜单操作 s -->
          <view class="cardsec_group">
            <view class="menu_left" @tap="goOnlineBooking">
              <image class="menu_left_img" :src="imgCDN + '/2.0/menu_order.png'"></image>
              <view class="menu_left_text">在线预订</view>
              <view class="menu_left_desc">无订单，去预订</view>
            </view>
            <view class="menu_part">
              <view class="menu_part_li menu_part_li_right1" @tap="goLiveinRegistration">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_tongzhu.png'"></image>
                <view class="menu_part_text">同住登记</view>
                <view class="menu_part_desc">已入住，去登记</view>
              </view>
              <view class="menu_part_li" @tap="goHotelService">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_service.png'"></image>
                <view class="menu_part_text">酒店服务</view>
                <view class="menu_part_desc">查看更多服务</view>
              </view>
            </view>
          </view>
          <!-- 1-3、菜单操作 e -->
        </view>
        <!-- 1、无预订单无在住单 e -->

        <!-- 2、有预订单 s -->
        <view class="content-order" v-if="data.situationType == 2">
          <!-- 2-1、多订单切换 s -->
          <view class="cardsec cardsec_multiple" @tap="showBookOrderList"
            v-if="data.orderList && data.orderList.length > 1">
            <image class="change_img" :src="imgCDN + '/2.0/item_icon_change.png'"></image>
            您在当前酒店有多个订单，点此切换
          </view>
          <!-- 2-1、多订单切换 e -->

          <!-- 2-2、预订详情 s -->
          <view class="cardsec cardsec_order">
            <!-- A.预订单: 未排房 s -->
            <view class="room_box" v-if="data.arrangeStatus == 4">
              <view class="floor_box">
                <view class="floorbg"></view>
                <image class="floormask" :src="imgCDN + '/2.0/floormask.png'"></image>
                <text class="floortext">-栋-层</text>
              </view>
              <text class="roomno roomno_gray">暂未排房</text>
            </view>
            <!-- A.预订单: 未排房 e -->

            <!-- B.预订单: 已排房 s -->
            <view class="room_box" v-else>
              <view class="floor_box">
                <view class="floorbg"></view>
                <image class="floormask" :src="imgCDN + '/2.0/floormask.png'"></image>
                <text class="floortext">{{ data.nowMatchRoomData.buildingName || '-' }}栋{{
                  data.nowMatchRoomData.floorName || '-' }}层</text>
              </view>
              <text class="roomno">{{ data.nowMatchRoomData.roomNo || '-' }}</text>
              <text class="roomtext">房间</text>
              <view class="switchlabel" @tap="showChangeRoom"
                v-if="data.changeRoomList && data.changeRoomList.length > 1 && data.nowMatchRoomData.roomNo">切换</view>
            </view>
            <!-- B.预订单: 已排房 e -->

            <!-- 预订人 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_user.png'"></image>
              <view class="item_li_value">{{ data.nowMatchRoomData.booker || '-' }}</view>
            </view>
            <!-- 房型 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_housetype.png'"></image>
              <view class="item_li_value">{{ data.nowMatchRoomData.roomTypeName || '-' }}</view>
            </view>
            <!-- 抵离日期(返回字段带'周N') -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_date.png'"></image>
              <view class="item_li_value">{{ _VFilterUtil._formatDate(data.nowMatchRoomData.startDate) }} <image
                  class="swap_img" :src="imgCDN + '/2.0/swap_right.png'"></image> {{
                    _VFilterUtil._formatDate(nowMatchRoomData.endDate) }}</view>
            </view>

            <!-- 操作按钮 -->
            <button class="button_primary item_button button_primary_disabled"
              v-if="data.arrangeStatus == 4">当前订单未排房，请联系前台</button>
            <button class="button_primary item_button button_primary_disabled item_button_more"
              v-else-if="data.arrangeStatus == 5">当前订单未到入住时间，不支持提前入住</button>
            <button class="button_primary item_button button_primary_disabled item_button_more"
              v-else-if="data.arrangeStatus == 6">当前订单已过入住时间，不支持自助入住</button>
            <button class="button_primary item_button" @tap="handleCheckInBtnClick" v-else>办理入住</button>
          </view>
          <!-- 2-2、预订详情 e -->

          <!-- 2-3、菜单操作 s -->
          <view class="cardsec_group">
            <view class="menu_part menu_part_row">
              <view class="menu_part_li menu_part_li_left_single" @tap="handleBackToSearch">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_searchOrder.png'"></image>
                <view class="menu_part_text">订单查询</view>
                <view class="menu_part_desc">有订单，去查询</view>
              </view>
              <view class="menu_part_li menu_part_li_right_single" @tap="goHotelService">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_service.png'"></image>
                <view class="menu_part_text">酒店服务</view>
                <view class="menu_part_desc">查看更多服务</view>
              </view>
            </view>
          </view>
          <!-- 2-3、菜单操作 e -->

          <!-- 2-4、温馨提示 s -->
          <view class="cardsec cardsec_tip" v-if="data.hotelTips">
            <view class="cardsec_title">温馨提示</view>
            <view class="rich-text-content">
              <rich-text :nodes="data.hotelTips"></rich-text>
            </view>
          </view>
          <!-- 2-4、温馨提示 e -->
        </view>
        <!-- 2、有预订单 e -->

        <!-- 3、有在住单 s -->
        <view class="content-checkin" v-if="data.situationType == 3 && data.checkinOrder">
          <!-- 3-1、入住详情 s -->
          <view class="cardsec cardsec_order">
            <view class="room_box">
              <view class="floor_box">
                <view class="floorbg"></view>
                <image class="floormask" :src="imgCDN + '/2.0/floormask.png'"></image>
                <text class="floortext">{{ data.checkinOrder.buildingName || '-' }}栋{{ data.checkinOrder.floorName ||
                  '-' }}层</text>
              </view>
              <text class="roomno">{{ data.checkinOrder.roomNo }}</text>
              <text class="roomtext">房间</text>
            </view>
            <!-- 入住人 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_user.png'"></image>
              <view class="item_li_value">{{ data.checkinOrder.guestName }}</view>
            </view>
            <!-- 房型 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_housetype.png'"></image>
              <view class="item_li_value">{{ data.checkinOrder.roomTypeName }}</view>
            </view>
            <!-- 抵离日期 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_date.png'"></image>
              <view class="item_li_value">{{ _VFilterUtil._formatDate(data.checkinOrder.checkInTime) }}({{
                data.checkinOrder.checkInDay }}) <image class="swap_img" :src="imgCDN + '/2.0/swap_right.png'"></image>
                {{ _VFilterUtil._formatDate(data.checkinOrder.checkOutTime) }}({{ data.checkinOrder.checkOutDay }})
              </view>
            </view>
            <!-- 同住人 -->
            <view class="item_li">
              <image class="item_li_icon" :src="imgCDN + '/2.0/item_icon_inmate.png'"></image>
              <view class="item_li_value">{{ data.checkinOrder.inmateUnames || '--' }} </view>
            </view>

            <button class="button_primary item_button" @tap="goCheckout">结账退房</button>
          </view>
          <!-- 3-1、入住详情 e -->

          <!-- 3-2、菜单操作 s -->
          <view class="cardsec_group">
            <view class="menu_part">
              <view class="menu_part_li" @tap="handleAddOccupantMenu">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_tongzhu.png'"></image>
                <view class="menu_part_text">添加同住人</view>
                <view class="menu_part_desc">在住，可增同住人员</view>
              </view>
              <view class="menu_part_li menu_part_li_left2" @tap="goHotelService">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_service.png'"></image>
                <view class="menu_part_text">酒店服务</view>
                <view class="menu_part_desc">查看更多服务</view>
              </view>
            </view>
            <view class="menu_part">
              <view class="menu_part_li menu_part_li_right1" @tap="goOnlineContinuation">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_stayOver.png'"></image>
                <view class="menu_part_text">在线续住</view>
                <view class="menu_part_desc">未离店，可续住</view>
              </view>
              <view class="menu_part_li" @tap="goBillingRecord">
                <image class="menu_part_img" :src="imgCDN + '/2.0/menu_invoice.png'"></image>
                <view class="menu_part_text">开票记录</view>
                <view class="menu_part_desc">已开票，可查看</view>
              </view>
            </view>
          </view>
          <!-- 3-2、菜单操作 e -->

          <!-- 3-3、温馨提示 s -->
          <view class="cardsec cardsec_tip" v-if="data.hotelTips">
            <view class="cardsec_title">温馨提示</view>
            <view class="rich-text-content">
              <rich-text :nodes="data.hotelTips"></rich-text>
            </view>
          </view>
          <!-- 3-3、温馨提示 e -->
        </view>
        <!-- 3、有在住单 e -->
      </view>
    </scroll-view>
    <!-- end 内容主体区域 -->

    <!-- start 预订单情形-底部弹窗: 切换订单/切换房间号 -->
    <bottom-popup id="bottom_popup" :bottomPopupTitle="data.popupTitle[data.popupStatus]"
      :bottomPopupHeight="data.windowHeight * 0.8" @change="changePopupBottom"
      v-if="data.situationType == 2 && data.visible">
      <!-- 1.订单列表 s -->
      <view v-if="data.popupStatus === 'order'" class="reserve_order_list">
        <view v-for="item in data.orderList" :key="item.orderId" @tap="selectOrderArrange" :data-orderid="item.orderId"
          class="reserve_order_item" :class="item.orderId == data.selectedOrderId ? 'item_selected' : ''">
          <!-- 预订人 -->
          <view class="order_header"><label class="order_header_label">预订人</label>{{ item.bookPerson || '--' }}</view>
          <view class="horder_list">
            <block v-for="hItem in item.orderList_byGroup" :key="hItem.roomTypeId">
              <!-- 房单数据项 s -->
              <view class="horder_item">
                <!-- 房型 -->
                <view class="horder_item_block">
                  <image class="horder_item_icon" :src="imgCDN + '/2.0/item_icon_housetype.png'"></image>
                  <view class="horder_item_value">{{ hItem.roomTypeName || '--' }} </view>
                </view>
                <!-- 入离时间 & 间数 -->
                <block v-for="rgItem in hItem.roomGroupList" :key="rgItem.index">
                  <view class="horder_item_block">
                    <image class="horder_item_icon" :src="imgCDN + '/2.0/item_icon_date.png'"></image>
                    <view class="horder_item_value">{{ _VFilterUtil._formatDate(rgItem.startTime) }} - {{
                      _VFilterUtil._formatDate(rgItem.endTime) }} <text class="horder_item_roomcount">{{
                        rgItem.roomCount }}间</text></view>
                  </view>
                </block>
              </view>
              <!-- 房单数据项 e -->
            </block>
          </view>
          <!-- 选中角标 -->
          <image v-if="item.orderId == data.selectedOrderId" class="order_selected"
            :src="imgCDN + '/2.0/occupant-check.png'" mode="widthFix" />
        </view>
      </view>
      <!-- 1.订单列表 e -->

      <!-- 2.更换房间 s -->
      <view v-if="data.popupStatus === 'room'" class="change_rooms_list">
        <view class="change_rooms_item" :data-room="item" @tap="changeRoom" v-for="item in data.changeRoomList"
          :key="item.roomNo">
          <view class="change_rooms_title">房间{{ item.roomNo }}{{ item.status == 1 ? '(已住' + item.checkInNum + '人)' : '' }}
          </view>
          <image v-if="data.nowMatchRoomData.roomNo == item.roomNo" class="change_rooms_selected"
            :src="imgCDN + '/2.0/roomSelectedIcon.png'" mode="widthFix" />
        </view>
      </view>
      <!-- 2.更换房间 e -->
    </bottom-popup>
    <!-- end 预订单情形-底部弹窗: 切换订单/切换房间号 -->

    <!-- start 在住单情形-上拉抽屉: 选择更多入住人 s -->
    <bottom-popup id="bottom-popup_occupant" bottomPopupTitle="选择入住人" :bottomPopupHeight="data.windowHeight * 0.8"
      @change="changePopupBottom" v-if="data.situationType == 3">
      <view class="his-occupant-container" :style="{ height: data.windowHeight * 0.8 - 168 + 'rpx' }">
        <view class="his-occupant-inner">
          <view v-for="item in data.occupantList" :key="item.id" class="his-occupant-unit"
            :class="item.id == data.crtOccupant.id ? 'crt' : ''" :data-item="item" @tap="selectOtherOccupant">
            <view class="his-occupant-item">
              <view class="h-o-item__label">姓名</view>
              <view class="h-o-item__content">{{ item.name }}</view>
            </view>
            <view class="his-occupant-item">
              <view class="h-o-item__label">身份证号</view>
              <view class="h-o-item__content">{{ item.maskIdCard }}</view>
            </view>
            <image class="his-occupant-img__checked" :src="imgCDN + '/2.0/occupant-check.png'" />
          </view>
        </view>
        <view class="occupant-btns">
          <!-- 普通按钮 -->
          <button class="occupant-btn occupant-btn_invite" @tap="handleInviteAddOccupant"
            v-if="!data.isCanAddOccupant">邀同住人填写</button>
          <!-- 分享按钮 -->
          <button class="occupant-btn occupant-btn_invite" open-type="share" @tap="handleInviteAddOccupant"
            v-if="data.isCanAddOccupant">邀同住人填写</button>
          <button class="occupant-btn" form-type="submit" @tap="handleAddOccupant">添加入住人</button>
        </view>
      </view>
    </bottom-popup>
    <!-- end 在住单情形-上拉抽屉: 选择更多入住人 e -->

    <!-- 入住助手客服icon -->
    <customer-service :isCustomeNavPage="true" :isTabBarPage="true"
      @changeVisibleState="setTabBarDisplay"></customer-service>
    <!-- toast弹窗 -->
    <Toast ref="toastRef"></Toast>
  </view>

  <!-- 隐私协议 -->
  <privacy-dialog :defaultShow="true" @agree="handleAgreeClick" @changeVisibleState="setTabBarDisplay"></privacy-dialog>

  <!-- 打开调试 -->
  <view class="debug" @longtap="toSysteminfo"></view>
  <!-- 自定义 TabBar -->
  <!-- #ifdef MP-WEIXIN -->
  <custom-tab-bar />
  <!-- #endif -->
</template>

<script setup>
import { ref, reactive } from 'vue';
import AAA from './aaa.jsx'
const message = ref('Vue3组合式API生效！');
const changeMessage = () => {
  message.value = 'Vue3 + Webpack5 MPA 成功！';
};

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style scoped>
.vue3-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
h1 {
  color: #42b983;
}
</style>