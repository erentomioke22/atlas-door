// lib/auth-shared.ts

export const clientAdditionalFields = {
    displayName: {
      type: "string",
      required: false,
    },
    phone: {
      type: "string",
      required: false,
    },
    address: {
      type: "string",
      required: false,
    },
  } as const;