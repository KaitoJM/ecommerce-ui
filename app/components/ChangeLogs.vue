<template>
  <div class="flex flex-col max-h-full">
    <h1 class="text-2xl font-bold mb-4">Change Logs</h1>
    <div class="flex-1 overflow-y-hidden p-4 rounded-lg">
      <ul>
        <li
          v-for="(release, releaseKey) in changeLogs"
          :key="`release-${releaseKey}`"
        >
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 block rounded-full bg-primary"></div>
            <div class="flex items-center gap-2">
              <p class="text-xs">{{ formatDate(release.date) }}</p>
              <UBadge :label="release.version" variant="outline" />
            </div>
          </div>
          <div class="pl-8 border-l border-primary ml-2">
            <ul
              v-if="release.commits.length"
              class="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mt-4 flex flex-col gap-4"
            >
              <li
                v-for="(commit, commitKey) in release.commits"
                :key="`commit-${commitKey}`"
              >
                <p class="text-xs">{{ formatDate(commit.date) }}</p>
                <p class="py-2 font-bold text-sm">{{ commit.message }}</p>
                <div class="flex items-center gap-2">
                  <UAvatar :src="commit.avatar" class="size-4" />
                  <p class="text-xs text-neutral-500">
                    Commited by {{ commit.author }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const github = useGithub();
const { formatDate } = useDate();

const changeLogs = computed(() => {
  return github.changeLogs.value;
});

onMounted(() => {
  try {
    github.getChangeLogs();
  } catch (error) {}
});
</script>
