<script setup lang="ts">
import type { FormError } from "#ui/types";

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

  // wait for success
  // isAuthenticated.value = true;
  // navigateTo("/products");

  await new Promise((resolve) => setTimeout(resolve, 1000));
  invalidCredentials();
}

function invalidCredentials() {
  isLoading.value = false;
  toast.add({
    title: "Invalid credentials",
    description: "Please enter valid credentials",
    color: "red",
  });
}
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
                  placeholder="example@example.com"
                />
              </UFormGroup>

              <UFormGroup label="Password" name="password">
                <UInput
                  v-model="state.password"
                  type="password"
                  placeholder="••••••••••••••"
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
