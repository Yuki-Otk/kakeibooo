<template>
    <div class="root">
        <div class="calendar-target-select">
            <v-btn @click="displayPrevMonth()" icon><v-icon large>mdi-chevron-left</v-icon></v-btn>
            <div style="font-size:20px;font-weight:700;color:#616161">{{month}}月</div>
            <v-btn @click="displayNextMonth()" icon><v-icon large>mdi-chevron-right</v-icon></v-btn>
        </div>

        <div class="calendar-header">
            <div
              class="calendar-header-items"
              v-for="(item, index) in calendarHeader"
              :key="index"
              :class="[(index === 0 || index === 6) ? index === 0 ? 'header-sunday' : 'header-saturday' : 'header-weekday']"
            >
                {{ item }}
            </div>
        </div>
        <div class="calendar-body">
            <div
              class="calendar-body-row"
              v-for="(week, index) in monthlyExpenses"
              :key="index"
              :class="[index === 0 ? 'first-week' : 'other-week']">
                <div
                  @click="clickCalendarDate(day)"
                  v-ripple
                  class="calendar-body-items"
                  v-for="(day, index) of week"
                  :key="index"
                  :class="[(index === 0 || index === 6) ? index === 0 ? 'body-sunday' : 'body-saturday' : 'body-weekday']"
                >
                    <div style="display:flex;flex-direction:column;">
                        <div :class="[(index === 0 || index === 6) ? index === 0 ? 'label-sunday' : 'label-saturday' : 'label-weekday']">{{ day.date }}</div>
                        <div class="cost" v-show="day.cost !== null">¥{{ day.cost }}</div>
                        <div style="height:30px;" v-show="day.date !== null && day.cost === null"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs, inject, computed } from '@vue/composition-api';
import moment from 'moment';
import { getAll, getByMonth } from '../../apis/expensesApi';
import ExpensesKey from './expenses-key';
import { ExpensesStore } from '../../store/expenses';
import { DailyExpenses, Expenses } from '../../types/expensesTypes';

export default defineComponent({
    setup() {
        const expensesStore = inject<ExpensesStore>(ExpensesKey);

        if(!expensesStore) {
            throw new Error(`${ExpensesKey} is not provided...`);
        }

        const month = computed(() => expensesStore.month);
        const date = computed(() => expensesStore.date);
        const displayedMonth = computed(() => expensesStore.displayedMonth);
        const monthlyExpenses = computed(() => expensesStore.monthlyExpenses);

        const calendarHeader = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const displayPrevMonth = () => {
            const prevMonth  = (month.value - 1) > 0 ? month.value - 1 : 12;
            expensesStore.setMonth(prevMonth);
            expensesStore.setDate(1);
            expensesStore.setDayExpenses(0);
            getByMonth(month.value).then((response) => buildCalendarBody(response.data as Expenses[]));
        };
        const displayNextMonth = () => {
            const nextMonth = (month.value + 1) > 12 ? 1 : month.value + 1;
            expensesStore.setMonth(nextMonth);
            expensesStore.setDate(1);
            expensesStore.setDayExpenses(0);
            getByMonth(month.value).then((response) => buildCalendarBody(response.data as Expenses[]));
        }

        const buildCalendarBody = (data: Expenses[]) => {
            const targetMonth = moment().month(expensesStore.month - 1);
            const endOf = targetMonth.endOf("month").date();
            let weekIndex = 0;

            const updatedMonthlyExpenses = [...Array(6)].map(week => Array(7).fill({date: null, cost: null}));

            [...Array(endOf).keys()].map((_, i) => i + 1).forEach((date) => {
                // 探す日をdateとして、対応するデータがあるか探す
                const correspondingData = data.find(d => moment(d.targetDate).date() === date);
                const targetDay = correspondingData
                ? moment(correspondingData.targetDate).day()
                : moment(moment().year(2020).month(expensesStore.month - 1).date(date)).day();
                updatedMonthlyExpenses[weekIndex].splice(targetDay, 1, {date: date, cost: correspondingData ? correspondingData.cost : null});
                if(targetDay === 6) {
                    weekIndex++;
                }
            });
            expensesStore.setMonthlyExpenses(updatedMonthlyExpenses);
        }

        const clickCalendarDate = (day: DailyExpenses) => {
            if(day.date) {
                expensesStore.setDate(day.date);
            }
            if(day.cost) {
                expensesStore.setDayExpenses(day.cost);
            } else {
                expensesStore.setDayExpenses(0);
            }
        }

        onMounted(() => {
            getByMonth(expensesStore.month).then((response) => {
                buildCalendarBody(response.data as Expenses[]);
            });
        });

        return {
            month,
            displayedMonth,
            monthlyExpenses,
            calendarHeader,
            displayPrevMonth,
            displayNextMonth,
            onMounted,
            clickCalendarDate
        }
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');

.root {
    font-family: 'M PLUS Rounded 1c', sans-serif;
    width:inherit;
    height:600px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.calendar-area-menu {
    width: 100%;
    height: 70px;
    padding: 5px;
    display: flex;
    justify-content: space-between;
}

.calendar-header {
    width: 90%;
    height: 50px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #E0E0E0;
}

.calendar-body {
    width: 90%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    /* justify-content: center;
    align-items: center; */
}

.calendar-target-select {
    width: 100% !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

.calendar-header-items {
    height: 100%;
    width: 15%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
}

.calendar-body-items {
    height: 75px;
    width: 15%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
}

.header-sunday {
    background-color: #FF8A80;
    color: #FFFFFF;
    border-right: 2px solid #E0E0E0;
}
.header-saturday {
    background-color: #82B1FF;
    color: #FFFFFF;
}
.header-weekday {
    color: #616161;
    border-right: 2px solid #E0E0E0;
}

.body-sunday {
    color: #616161;
    border-right: 2px solid #E0E0E0;
    background: #FFEBEE;
}
.body-saturday {
    color: #616161;
    background: #E3F2FD;
}
.body-weekday {
    color: #616161;
    border-right: 2px solid #E0E0E0;
}

.label-sunday {
    font-size: 18px;
    font-weight: 500;
    color: #FF8A80;
}
.label-saturday {
    font-size: 18px;
    font-weight: 500;
    color: #82B1FF;
}
.label-weekday {
    font-size: 18px;
    font-weight: 500;
    color: #616161;
}
.calendar-body-row {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.first-week {
    border: 2px solid rgb(224, 224, 224);
}
.other-week {
    border-right: 2px solid rgb(224, 224, 224);
    border-bottom: 2px solid rgb(224, 224, 224);
    border-left: 2px solid rgb(224, 224, 224);
}
.cost {
    font-weight:400;
    font-size:20px;
    font-family: 'Coiny', cursive;
    letter-spacing:1px;
    color:#757575;
}
</style>
