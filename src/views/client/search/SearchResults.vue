<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto p-2 space-y-6">
                <!-- Search Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">
                        Search Results
                    </h1>
                    <p class="text-gray-600">
                        Results for > {{ searchStore?.query || 'content' }}
                    </p>
                </div>

                <!-- Tabs -->
                <div class="mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                @click="activeTab = 'all'"
                                :class="[
                                    activeTab === 'all'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                                ]"
                            >
                                All Results
                            </button>
                            <button
                                @click="activeTab = 'posts'"
                                :class="[
                                    activeTab === 'posts'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                                ]"
                            >
                                Posts ({{ searchStore.results.posts.length }})
                            </button>
                            <button
                                @click="activeTab = 'users'"
                                :class="[
                                    activeTab === 'users'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                                ]"
                            >
                                Users ({{ searchStore.results.users.length }})
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Loading State -->
                <div
                    v-if="searchStore.loading"
                    class="flex justify-center py-12"
                >
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    ></div>
                </div>

                <!-- No Results -->
                <div
                    v-else-if="
                        !searchStore.hasResults && searchStore.hasSearched
                    "
                    class="text-center py-12"
                >
                    <Search class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">
                        No results found
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Try adjusting your search terms.
                    </p>
                </div>

                <!-- Results -->
                <div v-else>
                    <!-- All Results -->
                    <div v-if="activeTab === 'all'" class="space-y-8">
                        <!-- Posts Section -->
                        <div v-if="searchStore.results.posts.length > 0">
                            {{ console.log(searchStore.results) }}
                            <h2
                                class="text-lg font-semibold text-gray-900 mb-4"
                            >
                                Posts
                            </h2>
                            <div class="space-y-4">
                                <div
                                    v-for="post in searchStore.results.posts"
                                    :key="post.id"
                                    class="bg-white p-4 rounded-lg border-gray-200"
                                >
                                    <postCard :post="post" />
                                </div>
                            </div>
                        </div>

                        <!-- Users Section -->
                        <div v-if="searchStore.results.users.length > 0">
                            <h2
                                class="text-lg font-semibold text-gray-900 mb-4"
                            >
                                Users
                            </h2>
                            <div class="space-y-4">
                                <div
                                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                                >
                                    <div
                                        v-for="user in searchStore.results
                                            .users"
                                        :key="user.id"
                                        class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                                    >
                                        <usersList :user="user" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Posts Only -->
                    <div v-else-if="activeTab === 'posts'" class="space-y-4">
                        <div
                            v-for="post in searchStore.results.posts"
                            :key="post.id"
                            class="bg-white p-4 rounded-lg border-gray-200"
                        >
                            <postCard :post="post" />
                        </div>
                    </div>

                    <!-- Users Only -->
                    <div v-else-if="activeTab === 'users'" class="space-y-4">
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                        >
                            <div
                                v-for="user in searchStore.results.users"
                                :key="user.id"
                                class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <usersList :user="user" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSearchStore } from '@/stores/search'
import { Search } from 'lucide-vue-next'
import postCard from '@/components/postCard.vue'
import usersList from '@/components/usersList.vue'

const searchStore = useSearchStore()
const activeTab = ref('all')

onMounted(() => {
    // If coming from a search, the query should already be set
    if (searchStore.query && !searchStore.hasResults) {
        // Re-perform search if needed
        console.log(searchStore.results)
    }
})
</script>
