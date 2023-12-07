<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { Response } from "types";

const isLoading = ref(false);
const isAuthenticated = useIsAuthenticated();
const toast = useToast();

const state = reactive({ email: "", password: "" });

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "id", message: "Required" });
  if (!state.password) errors.push({ path: "name", message: "Required" });
  return errors;
};

async function onSubmit() {
  isLoading.value = true;
  useInvoke("auth", {
    email: state.email,
    password: state.password,
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));

  if (!isLoading.value) return;

  // show timeout after 10 seconds
  toast.add({
    title: "Timeout",
    description: "Please try again later",
    color: "red",
  });

  isLoading.value = false;
}

const unlisten = await useListen<string>("server", ({ payload }) => {
  const response = JSON.parse(payload) as Response;

  switch (response.code) {
    case "AUTH_SUCCESS":
      isAuthenticated.value = true;
      navigateTo("/");
      break;

    case "AUTH_FAILED":
      toast.add({
        title: "Invalid credentials",
        description: "Please enter valid credentials",
        color: "red",
      });
      break;
  }

  isLoading.value = false;
});

onUnmounted(async () => unlisten());
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <!-- div center page max-w-xs -->
      <div class="flex items-center justify-center h-full">
        <UForm :validate="validate" :state="state" @submit="onSubmit">
          <UModalCard class="w-80">
            <template #header>
              <h1 class="font-semibold text-lg select-auto">Login</h1>
              <p class="my-1">Authenticate to access the system</p>
            </template>

            <div class="flex flex-col gap-4">
              <UFormGroup label="Email" name="email">
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="example@example.com"
                  autocomplete="off"
                />
              </UFormGroup>

              <UFormGroup label="Password" name="password">
                <UInput
                  v-model="state.password"
                  type="password"
                  placeholder="••••••••••••••"
                  autocomplete="off"
                />
              </UFormGroup>
            </div>

            <template #footer>
              <UButton
                type="submit"
                color="primary"
                variant="solid"
                :loading="isLoading"
                label="Login"
              />
            </template>
          </UModalCard>
        </UForm>
      </div>
    </NuxtLayout>
  </div>
</template>
