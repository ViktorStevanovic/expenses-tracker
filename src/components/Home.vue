<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-5 bg-white py-4 px-3 my-card d-flex flex-column justify-content-between rounded-4">
                <section>
                    <div>
                        <h3 class="text-center">Expenses</h3>
                    </div>
                    <div class="text-center py-5 my-5">
                        <p>Spent this month</p>
                        <h1 class="text-danger">-{{ totalMonthExpenses }}</h1>
                    </div>
                </section>
                <!-- Middle-part -->
                <section class="overflow-auto">
                    <div class="d-flex justify-content-between">
                        <p>Today</p>
                        <p>{{ totalDayExpenses }}</p>
                    </div>
                    <!-- List of expenses -->
                    <section >
                        <div v-for="(expense, index) in expenses" class="d-flex flex-column mb-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex">
                                    <img src="" alt="">
                                    <div>
                                        <p class="fw-bold m-0">{{expense.category.name}}</p>
                                        <p class="m-0">{{expense.created_at.substring(11, 16)}} PM</p>
                                    </div>
                                </div>
                                <p class="text-danger m-0">{{expense.amount}} $</p>
                            </div>
                        </div>
                    </section>
                    
                </section>
                <!-- Footer -->
                <section>
                    <div class="border-top d-flex justify-content-between pt-3">
                        <a class="m-0" href="">Analytics</a>
                        <!-- Modal for adding expenses -->
                        <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                            <div class="modal-dialog modal-dialog-centered ">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-6" id="exampleModalToggleLabel">{{ currentDate }}</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                     <div class="modal-body">
                                        <div class="form-floating mb-3">
                                            <input type="number" class="form-control" v-model="amount" id="amount" name="amount" value="{{ $expense.amount }}" placeholder="0">
                                            <label for="amount">Oh god, again?</label>
                                        </div>
                                        <button @click="addExpense">Add Expense</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                          
                            <button class="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Open first modal</button>
                            
                        <a href="">Change logs</a>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'Home',
    data() {
        return {
            expenses: [],
            currentDate: '',
            amount: '',
            category_id: 1,
            date: '2023-01-02'
        }
    },
    computed: {
        totalMonthExpenses() {
        const currentMonth = (new Date()).getMonth();
        return this.expenses.reduce((total, expense) => {
            const expenseMonth = (new Date(expense.created_at)).getMonth();
            if (expenseMonth === currentMonth) {
                total += parseFloat(expense.amount); // Convert string to float
            }
            return total;
        }, 0);
    },
    totalDayExpenses() {
        const currentDate = new Date().toDateString();
        return this.expenses.reduce((total, expense) => {
            const expenseDate = new Date(expense.created_at).toDateString();
            if (expenseDate === currentDate) {
                total += parseFloat(expense.amount); // Convert string to float
            }
            return total;
        }, 0);
    },
    },
    methods: {
        getExpenses() {
                axios.get('http://127.0.0.1:8000/api/expenses')
                .then( response => {
                    console.log(response.data.results);
                    this.expenses = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            isCurrentMonth(created_at) {
                const date = new Date(created_at);
                const currentDate = new Date();
                return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
            },
            // Check if the provided date is today
            isCurrentDay(created_at) {
                const date = new Date(created_at);
                const currentDate = new Date();
                return date.toDateString() === currentDate.toDateString();
            },

        addExpense() {
            // Prepare the data object with the necessary fields
            const data = {
                amount: this.amount,
                category_id: this.category_id,
                date: this.date
            };

            // Make an API POST request to the Laravel backend
            axios.post('http://127.0.0.1:8000/api/expenses', data)
                .then(response => {
                    // Handle successful response
                    console.log(response.data);
                    // Optionally, you can reset the form fields after successful submission
                    this.amount = '';
                  
                    this.getExpenses();
                })
                .catch(error => {
                    // Handle error
                    console.error('Error adding expense:', error);
                });
        },   
    },
        mounted() {
    // Update current date when the component is mounted
            const currentDate = new Date();
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = monthNames[currentDate.getMonth()];
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();
            this.currentDate = `Today at ${dayOfWeek}, ${day} ${month} ${year}`;
},
    created() {
        this.getExpenses();
    },
}
</script>
<style lang="scss">
   .my-card{
    height: 100vh;
   };
   .overflow-auto::-webkit-scrollbar {
    display: none; /* Hide the scrollbar */
}

</style>