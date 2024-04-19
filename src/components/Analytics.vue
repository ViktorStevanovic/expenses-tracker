<template>
   <div class="container">
      <div class="row justify-content-center">
         <div class="col-12 col-md-5 bg-white px-3 d-flex flex-column justify-content-evenl rounded-4">
            <div class="my-smallest pt-4">
               <h3 class="text-center color mb-4">Analytics</h3>
            </div>
            <section class="d-flex flex-column justify-content-center align-items-center my-card">
               <canvas id="expenseChart" width="500" height="250"></canvas>
               <div class="text-center my-4">
                  <p class="text-secondary fs-5 m-0">Spent this month</p>
                  <h1 class="text-danger zilla-slab-regular">-{{ totalMonthExpenses }}€</h1>
               </div>
            </section>
            <!-- Middle-part -->
            <section class="overflow-auto my-medium">
               <div class="d-flex justify-content-between">
                  <p class="text-secondary">Categories</p>
                  <p class="text-secondary">Total spent</p>
               </div>
               <!-- List of expenses by category -->
               <section>
                  <div v-for="(categoryTotal, categoryName) in totalExpensesByCategory" :key="categoryName" class="d-flex justify-content-between py-3">
                     <div>
                        <p class="fw-bold m-0 color">{{ categoryName }}</p>
                     </div>
                     <p class="text-danger m-0">{{ categoryTotal }}€</p>
                  </div>
               </section>
            </section>
            <!-- Footer -->
            <section>
               <div class="border-top d-flex justify-content-between align-items-center my-small">
                  <router-link to="/analytics"><i class="fa-solid fa-chart-pie fa-lg" style="color: #669bbc"></i></router-link>
                  <router-link to="/"><i class="fa-solid fa-house fa-lg" style="color: #669bbc"></i></router-link>
                  <router-link to="/transactions"><i class="fa-solid fa-layer-group fa-lg" style="color: #669bbc"></i></router-link>
               </div>
            </section>
         </div>
      </div>
   </div>
</template>

<script>
   import axios from "axios";
   import Chart from "chart.js/auto";

   export default {
      name: "Analytics",
      data() {
         return {
            expenses: [],
            categories: [],
            currentDate: "",
            amount: "",
            category_id: 0,
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
         totalExpensesByCategory() {
            const totalByCategory = {};
            this.expenses.forEach((expense) => {
               const categoryName = expense.category.name;
               totalByCategory[categoryName] = (totalByCategory[categoryName] || 0) + parseFloat(expense.amount);
            });
            // Convert object into an array of key-value pairs
            const sortedCategories = Object.entries(totalByCategory);

            // Sort the array based on the value (amount), with the highest amount staying at the top
            sortedCategories.sort((a, b) => b[1] - a[1]);

            // Convert the sorted array back into an object
            const sortedTotalByCategory = Object.fromEntries(sortedCategories);

            return sortedTotalByCategory;
         },
      },
      methods: {
         // Method to render the graph
         renderChart(labels, data) {
            const ctx = document.getElementById("expenseChart").getContext("2d");
            new Chart(ctx, {
               type: "line",
               data: {
                  labels: labels,
                  datasets: [
                     {
                        label: "Amount Spent",
                        data: data,
                        borderColor: "rgba(255, 0, 0, 1)",
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                        borderWidth: 1,
                     },
                  ],
               },
               options: {
                  scales: {
                     x: {
                        // Force all labels to be displayed
                        maxRotation: 0,
                        autoSkip: false,
                     },
                     y: {
                        beginAtZero: true,
                     },
                  },
               },
            });
         },
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
               })
               .catch(function (error) {
                  console.log(error);
               });
         },
         addExpense() {
            const data = {
               amount: this.amount,
               category_id: this.category_id,
            };
            axios
               .post("http://127.0.0.1:8000/api/expenses", data)
               .then((response) => {
                  console.log(response.data);
                  this.amount = "";
                  this.category_id = "";
                  this.getExpenses();
               })
               .catch((error) => {
                  console.error("Error adding expense:", error);
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
