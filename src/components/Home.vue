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
                        <h1 class="text-danger">-654.00$</h1>
                    </div>
                </section>
                <!-- Middle-part -->
                <section>
                    <div class="d-flex justify-content-between">
                        <p>Today</p>
                        <p>-654.00$</p>
                    </div>
                    <!-- List of expenses -->
                    <div class="d-flex flex-column mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex">
                                <img src="" alt="">
                                <div>
                                    <p class="fw-bold m-0">Gas</p>
                                    <p class="m-0">02:05pm</p>
                                </div>
                            </div>
                            <p class="text-danger m-0">-10$</p>
                        </div>
                    </div>
                    <div class="d-flex flex-column mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex">
                                <img src="" alt="">
                                <div>
                                    <p class="fw-bold m-0">Gas</p>
                                    <p class="m-0">02:05pm</p>
                                </div>
                            </div>
                            <p class="text-danger m-0">-10$</p>
                        </div>
                    </div>
                    <div class="d-flex flex-column mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex">
                                <img src="" alt="">
                                <div>
                                    <p class="fw-bold m-0">Gas</p>
                                    <p class="m-0">02:05pm</p>
                                </div>
                            </div>
                            <p class="text-danger m-0">-10$</p>
                        </div>
                    </div>
                </section>
                <!-- Footer -->
                <section>
                    <div class="border-top d-flex justify-content-between pt-3">
                        <a class="m-0" href="">Analytics</a>
                        <a href="">+</a>
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
            
        }
    },
    methods: {
        getExpenses() {
                axios.get('http://127.0.0.1:8000/api/expenses')
                .then( response => {
                    console.log(response.data.results);
                    // this.expenses = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
    },
    created() {
        this.getExpenses();
    },
}
</script>
<style lang="scss">
   .my-card{
    height: 100vh;
   }
</style>