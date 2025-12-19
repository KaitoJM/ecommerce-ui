<template>
  <div class="flex flex-col max-h-full">
    <h1 class="text-2xl font-bold mb-4">Change Logs</h1>
    <div class="flex-1 overflow-y-hidden p-4 rounded-lg">
      <ul>
        <li
          v-for="(release, releaseKey) in changeLogs"
          :key="`release-${releaseKey}`"
        >
          <p>{{ release.date }}</p>
          <ul v-if="release.commits.length">
            <li
              v-for="(commit, commitKey) in release.commits"
              :key="`commit-${commitKey}`"
            >
              <p>{{ commit.date }} - {{ commit.message }}</p>
              <p>{{ commit.author }}</p>
            </li>
          </ul>
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
