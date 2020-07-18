import { reactive } from '@vue/composition-api';
import moment from 'moment';

type ExpensesStoreProps = {
  month: number,
  date: number,
  dayExpenses: number,
  displayedMonth?: number,
  monthlyExpenses: DayExpenses[][],
}

type DayExpenses = {
  date: number | null,
  cost: number | null
};

export default function expensesStore() {
  const state = reactive<ExpensesStoreProps>({
    // momentjsのmonthは実際より1小さい値を利用しているので+1しておく
    month: moment().month() + 1,
    date: moment().date(),
    dayExpenses: 0,
    displayedMonth: moment().month() + 1,
    monthlyExpenses: [...Array(6)].map(week => Array(7).fill({date: null, cost: null})),
  });

  return {
    // getter
    get month() {
      return state.month;
    },
    get date() {
      return state.date;
    },
    get dayExpenses() {
      return state.dayExpenses;
    },
    get displayedMonth() {
      return state.displayedMonth
    },
    get monthlyExpenses() {
      return state.monthlyExpenses;
    },

    // setter
    setMonth(month: number) {
      state.month = month;
    },
    setDate(date: number) {
      state.date = date;
    },
    setDayExpenses(dayExpenses: number) {
      state.dayExpenses = dayExpenses;
    },
    setDisplayedMonth(displayedMonth: number) {
      state.displayedMonth = displayedMonth
    },
    setMonthlyExpenses(monthlyExpenses: DayExpenses[][]) {
      state.monthlyExpenses = monthlyExpenses;
    },
  };
}

export type ExpensesStore = ReturnType<typeof expensesStore>;



// import { reactive, computed, ref } from '@vue/composition-api';
/** 参考：コンポーネント内の値の取り方 */
// export default function useExpenses() {
//   const count = ref(0);

//   function increment() {
//     count.value++;
//   }
//   function decrement() {
//     count.value--;
//   }

//   return {
//     count: computed(() => count.value),
//     increment,
//     decrement
//   }

// }