<template>
  <div class="flex flex-col max-h-full">
    <h1 class="text-2xl font-bold mb-4">Change Logs</h1>
    <div class="flex-1 overflow-y-hidden p-4 rounded-lg">
      <UTimeline :items="changeLogs">
        <template #avatar-description="{ item }">
          <div class="flex items-center gap-1">
            <UAvatar :src="item.avatar" class="size-4" />
            <span class="text-xs">{{ item.description }}</span>
          </div>
        </template>
      </UTimeline>
    </div>
  </div>
</template>

<script setup lang="ts">
const github = useGithub();
const { formatDate } = useDate();

const changeLogs = computed(() => {
  return github.changeLogs.value.map((item: ChangeLog) => {
    return {
      date: formatDate(item.date),
      title: item.message,
      description: item.author,
      icon: "i-lucide-code",
      slot: "avatar" as const,
      avatar: item.avatar,
      url: item.url,
    };
  });
});

onMounted(() => {
  try {
    github.getChangeLogs();
  } catch (error) {}
});
</script>
