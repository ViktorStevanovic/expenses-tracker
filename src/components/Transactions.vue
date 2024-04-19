<template>
   <div class="container">
      <div class="row justify-content-center">
         <div class="col-12 col-md-5 bg-white px-3 d-flex flex-column justify-content-evenl rounded-4">
            <div class="my-smallest pt-4">
               <h3 class="text-center color mb-4">Transactions</h3>
            </div>
            <section class="d-flex flex-column justify-content-center align-items-center my-card">
               <div class="text-center my-4">
                  <p class="text-secondary fs-5 m-0">This month's total transactions</p>
                  <h1 class="text-danger zilla-slab-regular">{{ currentMonthTransactions.length }}</h1>
               </div>
            </section>
            <!-- Middle-part -->
            <section class="overflow-auto my-medium">
               <div class="d-flex justify-content-between">
                  <p class="text-secondary">All</p>
                  <p class="text-secondary">Total</p>
               </div>
               <!-- List of expenses by category -->
               <section>
                  <div v-for="transaction in currentMonthTransactions" class="d-flex justify-content-between align-items-center mb-3">
                     <div>
                        <p class="fw-bold m-0 color">{{ transaction.category.name }}</p>
                        <p class="text-secondary m-0">{{ transaction.created_at.substring(0, 10) }}</p>
                     </div>
                     <p class="text-danger m-0">{{ transaction.amount }}€</p>
                  </div>
               </section>
            </section>
            <!-- Footer -->
            <section>
               <div class="border-top d-flex justify-content-between align-items-center my-small">
                  <router-link to="/analytics"><i class="fa-solid fa-chart-pie fa-lg" style="color: #669bbc"></i></router-link>
                  <router-link to="/"><i class="fa-solid fa-house fa-lg" style="color: #669bbc"></i></router-link>
                  <a href=""><i class="fa-solid fa-layer-group fa-lg" style="color: #669bbc"></i></a>
               </div>
            </section>
         </div>
      </div>
   </div>
</template>

<script>
   import axios from "axios";

   export default {
      name: "Transactions",
      data() {
         return {
            expenses: [],
            categories: [],
            currentDate: "",
            amount: "",
            category_id: 0,
            currentMonthTransactions: [],
         };
      },
      computed: {
         totalMonthExpenses() {
            const currentMonth = new Date().getMonth();
            return this.expenses.reduce((total, expense) => {
               const expenseMonth = new Date(expense.created_at).getMonth();
               if (expenseMonth === currentMonth) {
                  total += parseFloat(expense.amount); // Convert string to float
               }
               return total;
            }, 0);
         },
      },
      methods: {
         // Method to render the graph
         getCategories() {
            axios
               .get("http://127.0.0.1:8000/api/categories")
               .then((response) => {
                  console.log(response.data.results);
                  this.categories = response.data.results;
               })
               .catch(function (error) {
                  console.log(error);
               });
         },
         getExpenses() {
            axios
               .get("http://127.0.0.1:8000/api/expenses")
               .then((response) => {
                  console.log(response.data.results);
                  this.expenses = response.data.results;
                  this.currentMonthTransactions = this.expenses.filter((expense) => {
                     const expenseDate = new Date(expense.created_at);
                     const currentDate = new Date();
                     return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear();
                  });
                  this.currentMonthTransactions.sort((a, b) => {
                     const dateA = new Date(a.created_at);
                     const dateB = new Date(b.created_at);
                     return dateB - dateA;
                  });
               })
               .catch(function (error) {
                  console.log(error);
               });
         },
      },
      mounted() {
         const currentDate = new Date();
         // Fetch expenses for the current month
         axios
            .get("http://127.0.0.1:8000/api/expenses")
            .then((response) => {
               const expenses = response.data.results;

               // Filter expenses for the current month
               const currentMonthExpenses = expenses.filter((expense) => {
                  const expenseDate = new Date(expense.created_at);
                  const currentDate = new Date();
                  return expenseDate.getMonth() === currentDate.getMonth() && expenseDate.getFullYear() === currentDate.getFullYear();
               });

               // Group expenses by day
               const dailyExpenses = {};
               currentMonthExpenses.forEach((expense) => {
                  const expenseDate = new Date(expense.created_at).getDate();
                  dailyExpenses[expenseDate] = (dailyExpenses[expenseDate] || 0) + parseFloat(expense.amount);
               });

               // Prepare data for Chart.js
               const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
               const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Array from 1 to last day of the month
               const data = labels.map((day) => dailyExpenses[day] || 0);

               // Render the graph
               this.renderChart(labels, data);
            })
            .catch(function (error) {
               console.log(error);
            });

         const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDate.getDay()];
         const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
         const month = monthNames[currentDate.getMonth()];
         const day = currentDate.getDate();
         const year = currentDate.getFullYear();
         this.currentDate = `Today at ${dayOfWeek}, ${day} ${month} ${year}`;
         this.getExpenses();
         this.getCategories();
      },
      getCategoryExpenseCount(categoryId) {
         return this.expenses.filter((expense) => expense.category_id === categoryId).length;
      },
   };
</script>

<style lang="scss">
   @import url("https://fonts.googleapis.com/css2?family=Zilla+Slab&display=swap");

   .my-card {
      height: 48vh;
   }

   .my-medium {
      height: 40vh;
   }

   .my-small {
      height: 7vh;
   }

   .my-smallest {
      height: 5vh;
   }

   .overflow-auto::-webkit-scrollbar {
      display: none;
      /* Hide the scrollbar */
   }

   .zilla-slab-regular {
      font-family: "Zilla Slab", serif;
      font-weight: 400;
      font-style: normal;
      font-size: 4rem;
   }

   .color {
      color: #669bbc;
   }
</style>
