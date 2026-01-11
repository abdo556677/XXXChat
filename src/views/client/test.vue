<template>
    <div class="px-4 sm:px-8 pb-6">
        <!-- Profile Header -->
        <div
            class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20"
        >
            <!-- Profile Picture Section -->
            <div class="flex items-end gap-4">
                <div class="relative group">
                    <!-- Profile Avatar with hover effect -->
                    <div
                        class="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105"
                        :class="{
                            'ring-2 ring-offset-2':
                                userStore.currentUser?.isOnline,
                        }"
                        :style="{
                            '--tw-ring-color': userStore.currentUser?.isOnline
                                ? '#10B981'
                                : 'transparent',
                        }"
                    >
                        {{
                            userStore.currentUser?.name
                                ?.charAt(0)
                                .toUpperCase() || 'م'
                        }}
                    </div>

                    <!-- Online Status Indicator -->
                    <div
                        v-if="userStore.currentUser?.isOnline"
                        class="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"
                    ></div>
                </div>

                <!-- Mobile User Info (for small screens) -->
                <div class="sm:hidden">
                    <h1 class="text-xl font-bold text-gray-900">
                        {{ userStore.currentUser?.name || 'مستخدم' }}
                    </h1>
                    <VerificationBadge
                        :status="userStore.currentUser?.verificationStatus"
                        class="mt-1"
                    />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 self-end sm:self-auto">
                <template v-if="!isOwnProfile">
                    <!-- Follow Button -->
                    <button
                        :class="[
                            'px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2',
                            userStore.currentUser?.isFollowing
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700',
                        ]"
                        @click="toggleFollow"
                        aria-label="Follow user"
                    >
                        <UserPlus class="w-4 h-4" />
                        <span class="hidden sm:inline">
                            {{
                                userStore.currentUser?.isFollowing
                                    ? 'Following'
                                    : 'Follow'
                            }}
                        </span>
                    </button>

                    <!-- Message Button -->
                    <button
                        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        @click="startConversation"
                        aria-label="Send message"
                    >
                        <MessageCircle class="w-4 h-4" />
                        <span class="hidden sm:inline">Message</span>
                    </button>
                </template>

                <!-- Edit Profile Button (own profile) -->
                <button
                    v-if="isOwnProfile"
                    class="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                    @click="editProfile"
                    aria-label="Edit profile"
                >
                    <Settings class="w-4 h-4" />
                    <span class="hidden sm:inline">Edit Profile</span>
                </button>

                <!-- More Options Dropdown -->
                <div class="relative">
                    <button
                        class="p-2 sm:p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-gray-100"
                        @click="toggleOptions"
                        aria-label="More options"
                        aria-haspopup="true"
                        :aria-expanded="showOptions"
                    >
                        <MoreHorizontal class="w-5 h-5" />
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                        v-if="showOptions"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
                    >
                        <div class="py-2">
                            <button
                                v-if="!isOwnProfile"
                                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                @click="reportUser"
                            >
                                <Flag class="w-4 h-4" />
                                Report User
                            </button>
                            <button
                                v-if="!isOwnProfile"
                                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                @click="blockUser"
                            >
                                <Ban class="w-4 h-4" />
                                Block
                            </button>
                            <button
                                class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                @click="shareProfile"
                            >
                                <Share2 class="w-4 h-4" />
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Details -->
        <div class="mt-4 sm:mt-6">
            <!-- Desktop User Info -->
            <div class="hidden sm:block">
                <h1
                    class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2"
                >
                    <span>{{ userStore.currentUser?.name || 'مستخدم' }}</span>
                    <VerificationBadge
                        :status="userStore.currentUser?.verificationStatus"
                    />
                </h1>
            </div>

            <!-- Bio/Content -->
            <p class="text-gray-600 mt-2 sm:mt-3 line-clamp-3">
                {{ userStore.currentUser?.content || 'No bio yet' }}
            </p>

            <!-- Location & Additional Info -->
            <div
                class="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-gray-500 text-sm"
            >
                <!-- Location -->
                <div class="flex items-center gap-1">
                    <MapPin class="w-4 h-4 flex-shrink-0" />
                    <span>{{
                        userStore.currentUser?.location || 'Unknown location'
                    }}</span>
                </div>

                <!-- Join Date (if available) -->
                <div
                    v-if="userStore.currentUser?.joinDate"
                    class="flex items-center gap-1"
                >
                    <Calendar class="w-4 h-4 flex-shrink-0" />
                    <span
                        >Joined
                        {{
                            formatJoinDate(userStore.currentUser.joinDate)
                        }}</span
                    >
                </div>

                <!-- Website/Link (if available) -->
                <a
                    v-if="userStore.currentUser?.website"
                    :href="userStore.currentUser.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                >
                    <Link class="w-4 h-4 flex-shrink-0" />
                    <span>Website</span>
                </a>
            </div>

            <!-- Stats -->
            <div class="mt-6 pt-4 border-t border-gray-100">
                <div
                    class="flex items-center justify-around sm:justify-start sm:gap-8"
                >
                    <!-- Followers with clickable interaction -->
                    <button
                        class="text-center group"
                        @click="showFollowersModal"
                        aria-label="View followers"
                    >
                        <div
                            class="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                        >
                            {{
                                formatNumber(
                                    userStore.currentUser?.followersCount || 0,
                                )
                            }}
                        </div>
                        <div
                            class="text-xs sm:text-sm text-gray-500 group-hover:text-blue-500 transition-colors"
                        >
                            Followers
                        </div>
                    </button>

                    <!-- Following with clickable interaction -->
                    <button
                        class="text-center group"
                        @click="showFollowingModal"
                        aria-label="View following"
                    >
                        <div
                            class="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                        >
                            {{
                                formatNumber(
                                    userStore.currentUser?.followingCount || 0,
                                )
                            }}
                        </div>
                        <div
                            class="text-xs sm:text-sm text-gray-500 group-hover:text-blue-500 transition-colors"
                        >
                            Following
                        </div>
                    </button>

                    <!-- Posts with clickable interaction -->
                    <button
                        class="text-center group"
                        @click="scrollToPosts"
                        aria-label="View posts"
                    >
                        <div
                            class="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                        >
                            {{
                                formatNumber(
                                    userStore.currentUser?.postsCount || 0,
                                )
                            }}
                        </div>
                        <div
                            class="text-xs sm:text-sm text-gray-500 group-hover:text-blue-500 transition-colors"
                        >
                            Posts
                        </div>
                    </button>

                    <!-- Additional stat (if needed) -->
                    <div
                        v-if="userStore.currentUser?.likesCount"
                        class="text-center"
                    >
                        <div
                            class="text-xl sm:text-2xl font-bold text-gray-900"
                        >
                            {{ formatNumber(userStore.currentUser.likesCount) }}
                        </div>
                        <div class="text-xs sm:text-sm text-gray-500">
                            Likes
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Stats Bar (for larger screens) -->
            <div
                v-if="userStore.currentUser?.additionalStats"
                class="hidden lg:flex items-center gap-6 mt-4 pt-4 border-t border-gray-100"
            >
                <!-- Additional statistics can be added here -->
            </div>
        </div>
    </div>
</template>
