<template>
    <div class="list_item_root">
        <div class="list_name">{{listItem.staffName}}</div>
        <div class="list_count">{{listItem.staffCount}} {{listItem.unit}}</div>
        <div class="list_action">
            <v-btn
                @click="isOpenBuy=true"
                class="list_action_button"
                color="#FF8A80"
                elevation="0"
                height="30"
                width="75"
                small
            >
                買った！
            </v-btn>
            <v-btn
                @click="isOpenUse=true"
                class="list_action_button"
                color="#80CBC4"
                elevation="0"
                height="30"
                width="75"
                small
            >
                使った！
            </v-btn>

            <!-- 「買ったよ！」DLG -->
            <v-dialog v-model="isOpenBuy" width="600" height="360">
                <v-card>
                    <div class="dialog-title red accent-1">
                        <v-card-title class="red accent-1">「買ったよ！」</v-card-title>
                        <v-btn
                            @click="closeDialog"
                            icon
                            color="#FFFFFF"
                            style="margin-right:10px;"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                    <v-card-text class="card-body">
                        <v-container class="card-container">
                            <div class="card-title">
                                {{listItem.staffName}} を 何{{listItem.unit}} 買いましたか？
                            </div>
                             <div class="card-input">
                                <div class="card-input-count">
                                    <v-text-field
                                        v-model="count"
                                        color="#E0E0E0"
                                        height="100"
                                        width="200"
                                        :rules="[isInputMinus]"
                                        outlined
                                        flat
                                        solo
                                    />
                                </div>
                                <div class="card-input-unit">{{listItem.unit}}</div>
                                <div class="add-sub-part">
                                    <v-btn @click="count++" icon><v-icon>mdi-plus</v-icon></v-btn>
                                    <v-btn @click="count--" icon><v-icon>mdi-minus</v-icon></v-btn>
                                </div>
                             </div>
                             <div class="card-input-helper">
                                 <v-btn @click="addBuyCount(10)"  class="helper-button" color="#616161" text>+10</v-btn>
                                 <v-btn @click="addBuyCount(50)"  class="helper-button" color="#616161" text>+50</v-btn>
                                 <v-btn @click="addBuyCount(100)" class="helper-button" color="#616161" text>+100</v-btn>
                            </div>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="card-action">
                        <v-btn
                            width="100"
                            :disabled="canClickOkButton()"
                            color="red accent-1"
                            class="dialog-action-button"
                            elevation="0"
                            @click="closeDialogWithUpdate('buy')"
                        >
                            OK
                        </v-btn>
                        <v-btn
                            width="100"
                            color="red accent-1"
                            class="dialog-action-button"
                            text
                            @click="closeDialog"
                        >
                            キャンセル
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- 「使ったよ！」DLG -->
            <v-dialog v-model="isOpenUse" width="600" height="360">
                <v-card>
                    <div class="dialog-title teal lighten-3">
                        <v-card-title class="teal lighten-3">「使ったよ！」</v-card-title>
                        <v-btn
                            @click="closeDialog"
                            icon
                            color="#FFFFFF"
                            style="margin-right:10px;"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                    <v-card-text class="card-body">
                        <v-container class="card-container">
                            <div class="card-title">
                                {{listItem.staffName}} を 何{{listItem.unit}} 使いましたか？
                            </div>
                             <div class="card-input">
                                <div class="card-input-count">
                                    <v-text-field
                                        v-model="count"
                                        color="#E0E0E0"
                                        height="100"
                                        width="200"
                                        outlined
                                        flat
                                        solo
                                        :rules="[isInputMinus, isResultMinus]"
                                    />
                                </div>
                                <div class="card-input-unit">{{listItem.unit}}</div>
                                <div class="add-sub-part">
                                    <v-btn @click="count++" icon><v-icon>mdi-plus</v-icon></v-btn>
                                    <v-btn @click="count--" icon><v-icon>mdi-minus</v-icon></v-btn>
                                </div>
                             </div>
                             <div class="card-input-helper">
                                 <v-btn @click="addUseCount('all')" class="helper-button" color="#616161" text>全部使った</v-btn>
                                 <v-btn @click="addUseCount('half')" class="helper-button" color="#616161" text>半分使った</v-btn>
                            </div>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="card-action">
                        <v-btn
                            width="100"
                            :disabled="canClickOkButton()"
                            color="teal lighten-3"
                            class="dialog-action-button"
                            elevation="0"
                            @click="closeDialogWithUpdate('use')"
                        >
                            OK
                        </v-btn>
                        <v-btn
                            width="100"
                            color="teal lighten-3"
                            class="dialog-action-button"
                            text
                            @click="closeDialog"
                        >
                            キャンセル
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { FoodStaff, FoodStaffDialogState, FoodStaffConsumption, FoodStaffDialogType } from '../../types/foodStaffTypes';
import { updateById, deleteById } from '../../apis/foodStaffApi';

import { FOODSTAFF } from '../../messages/foodStaffMessages';

export default defineComponent({
    props: {
        listItem: {
            type: Object as () => FoodStaff,
            required: true
        }
    },
    setup(props) {
        const dialogState = reactive<FoodStaffDialogState>({
            isOpenBuy: false,
            isOpenUse: false,
            count: 0
        });

        // テキストFに負の値が入力されたときのエラーメッセージ
        const isInputMinus = (value: number) => value >= 0 || FOODSTAFF.ERROR_WITH_MINUS_INPUT;
        // テキストFに入力された値によって保存量がマイナスになったときのエラーメッセージ
        const isResultMinus = (value: number) => value <= props.listItem.staffCount || FOODSTAFF.ERROR_WITH_OVER_USAGE;

        /**
         * DLG上のOKボタンが押せる状態かどうかをチェック
         */
        const canClickOkButton = () => {
            if(dialogState.isOpenBuy) {
                // 「買ったよ！」DLGでは負数の入力は許容しない
                return dialogState.count < 0;
            } else {
                // 「使ったよ！」DLGでは負数の入力 および 保存量以上の使用量は許容しない
                return dialogState.count < 0 || dialogState.count > props.listItem.staffCount;
            }
        };

        /**
         * 引数で指定された分だけ買った個数を増やす
         */
        const addBuyCount = (value: number) => {
            dialogState.count = Number(dialogState.count) + value;
        };

        /**
         * 「全部使った」、「半分使った」が押された場合に使った個数を増やす
         */
        const addUseCount = (value: FoodStaffConsumption) => {
            dialogState.count = (value === 'all') ? dialogState.count = props.listItem.staffCount : dialogState.count = (props.listItem.staffCount / 2);
        };

        /**
         * キャンセルボタンを押してDLGを閉じる
         */
        const closeDialog = () => {
            dialogState.count = 0;
            dialogState.isOpenBuy = false;
            dialogState.isOpenUse = false;
            return
        };

        /**
         * OKボタンを押してDLGを閉じる
         */
        const closeDialogWithUpdate = (mode: FoodStaffDialogType) => {
            const targetId = props.listItem.id;
            const responseBody: Partial<FoodStaff> = {
                staffCount: (mode === 'buy') ?
                    Number(dialogState.count) + props.listItem.staffCount : props.listItem.staffCount - Number(dialogState.count)
            };

            if(responseBody.staffCount === 0) {
                // 食材を使った結果残りが0になった場合は、DELETEを投げる
                deleteById(targetId).then(response => {
                    if(response.status === 200) {
                        location.reload();
                    }
                });
                return;
            }
            // 基本的にはPUTを投げる
            updateById(targetId, responseBody).then(response => {
                if(response.status === 200) {
                    location.reload();
                }
            });
        };
        return {
            ...toRefs(dialogState),
            isInputMinus,
            isResultMinus,
            canClickOkButton,
            addBuyCount,
            addUseCount,
            closeDialog,
            closeDialogWithUpdate
        }
    }
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap');


.v-text-field >>> input {
    color: #616161 !important;
    font-weight: 700;
    font-size: 40px;
    text-align: right;
}

.list_item_root {
    padding: 5px;
    color: #616161;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px dashed #E0E0E0;
}
.list_name {
    width: 150px;
}
.list_count {
    width: 150px;
}
.list_action {
    width: 150px;
    display: flex;
    justify-content: space-between;
}
.list_action_button {
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 700;
    margin: 0 2px;
}

.dialog-title {
    color: #FFFFFF;
    font-weight: 700 !important;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-container {
    display: flex;
    flex-direction: column;
    padding: 0px !important;
}

.card-title {
    color: #616161;
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    height: 40px;
    padding: 5px;
}

.dialog-action-button {
    color: #FFFFFF;
    font-weight: 700;
}

.card-body {
    height: 240px;
    padding: 10px !important;
    font-family: 'M PLUS Rounded 1c', sans-serif;
}

.card-input {
    height: 120px;
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.card-input-count {
    width: 200px;
}

.add-sub-part {
    width: 50px;
    height: 100px;
    padding: 5px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.card-input-unit {
    width: 50px;
    height: 100px;
    padding: 10px;
    margin-left: 10px;
    color: #616161;
    font-weight: 700;
    font-size: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-input-helper {
    height: 70px;
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
.helper-button {
    font-weight: 700;
    font-size: 20px;
}
.card-action {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-family: 'M PLUS Rounded 1c', sans-serif;
}
</style>