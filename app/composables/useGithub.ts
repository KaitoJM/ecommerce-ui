import type { ApiError, ApiPaginated } from "~/types/ApiResponses.types";
import type { FetchError } from "ofetch";

export interface Commit {
  sha: string;
  message: string;
  author: string;
  avatar: string;
  date: string;
  url: string;
}

export interface Release {
  commits: Commit[];
  date: string;
  tag: string;
  url: string;
  version: string;
}

const config = useRuntimeConfig();
export const useGithub = () => {
  const changeLogs = ref<Release[]>([]);

  const getChangeLogs = async (): Promise<ApiPaginated<Release>> => {
    try {
      const res: ApiPaginated<Release> = await $fetch(
        `${config.public.apiBase}/change-logs`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      changeLogs.value = res.data;
      return res;
    } catch (error) {
      const fetchError = error as FetchError<any>;

      const apiError: ApiError = {
        message:
          fetchError.data?.message ??
          fetchError.message ??
          "Something went wrong",
        errors: fetchError.data?.errors,
        statusCode: fetchError.status,
      };

      console.error(`Failed to fetch changelogs`, error);
      throw apiError;
    }
  };

  return {
    changeLogs,
    getChangeLogs,
  };
};
