import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { authenticate } from "../server/authentication.ts";

Deno.test(
  "authenticate should return true for valid customer credentials",
  async () => {
    // Arrange
    const validEmail = "johndoe@company-a.example.com";
    const validPassword = "password";
    const expectedCustomerId = "company-a";

    // Act
    const result = authenticate(validEmail, validPassword, "customer");

    // Assert
    assertNotEquals(result, false); // @ts-expect-error
    assertEquals(result?.id, expectedCustomerId);
  }
);

Deno.test(
  "authenticate should return true for valid supplier credentials",
  async () => {
    // Arrange
    const validEmail = "johndoe@supplier-a.example.com";
    const validPassword = "password";
    const expectedSupplierId = "clothes";

    // Act
    const result = authenticate(validEmail, validPassword, "supplier");

    // Assert
    assertNotEquals(result, false); // @ts-expect-error
    assertEquals(result?.id, expectedSupplierId);
  }
);

Deno.test(
  "authenticate should return false for invalid customer credentials",
  async () => {
    // Arrange
    const invalidEmail = "johndoe@company-a.example.com";
    const invalidPassword = "company-a";

    // Act
    const result = authenticate(invalidEmail, invalidPassword, "customer");

    // Assert
    assertEquals(result, false);
  }
);

Deno.test(
  "authenticate should return false for invalid supplier credentials",
  async () => {
    // Arrange
    const invalidEmail = "johndoe@supplier-a.example.com";
    const invalidPassword = "wrongpassword";

    // Act
    const result = authenticate(invalidEmail, invalidPassword, "supplier");

    // Assert
    assertEquals(result, false);
  }
);

Deno.test(
  "authenticate should return false for invalid customer email",
  async () => {
    // Arrange
    const invalidEmail = "nonexistent@example.com";
    const invalidPassword = "wrongpassword";

    // Act
    const result = authenticate(invalidEmail, invalidPassword, "customer");

    // Assert
    assertEquals(result, false);
  }
);

Deno.test(
  "authenticate should return false for invalid supplier email",
  async () => {
    // Arrange
    const invalidEmail = "nonexistent@example.com";
    const invalidPassword = "wrongpassword";

    // Act
    const result = authenticate(invalidEmail, invalidPassword, "supplier");

    // Assert
    assertEquals(result, false);
  }
);
