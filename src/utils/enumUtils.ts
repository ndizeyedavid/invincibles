// @ts-nocheck

import { 
  ApplicationStatusEnum, 
  DefaultStatusEnum,
  DocumentStatusEnum,
  ApplicantStatusEnum
} from '../../drizzle/schema';

type EnumType = {
  enumValues: { [key: string]: string }
};

/**
 * Generic function to convert string to enum value
 * @param enumObj The enum object to convert to
 * @param value The string value to convert
 * @returns The enum value or undefined if invalid
 */
export function toEnum<T extends EnumType>(enumObj: T, value: string): keyof T['enumValues'] | undefined {
  if (Object.values(enumObj.enumValues).includes(value)) {
    return value as keyof T['enumValues'];
  }
  return undefined;
}

/**
 * Convert string to ApplicationStatus enum
 */
export function toApplicationStatus(value: string): keyof typeof ApplicationStatusEnum.enumValues | undefined {
  return toEnum(ApplicationStatusEnum, value);
}

/**
 * Convert string to DefaultStatus enum
 */
export function toDefaultStatus(value: string): keyof typeof DefaultStatusEnum.enumValues | undefined {
  return toEnum(DefaultStatusEnum, value);
}

/**
 * Convert string to DocumentStatus enum
 */
export function toDocumentStatus(value: string): keyof typeof DocumentStatusEnum.enumValues | undefined {
  return toEnum(DocumentStatusEnum, value);
}

/**
 * Convert string to ProcessStatus enum
 */
export function toProcessStatus(value: string): keyof typeof ProcessStatusEnum.enumValues | undefined {
  return toEnum(ProcessStatusEnum, value);
}

/**
 * Convert string to ApplicantStatus enum
 */
export function toApplicantStatus(value: string): keyof typeof ApplicantStatusEnum.enumValues | undefined {
  return toEnum(ApplicantStatusEnum, value);
}

/**
 * Type guard to check if a string is a valid enum value
 */
export function isValidEnumValue<T extends EnumType>(enumObj: T, value: string): value is keyof T['enumValues'] {
  return Object.values(enumObj.enumValues).includes(value);
}


/**
 * Extracts array of values from a Drizzle MySQL enum
 * @param drizzleEnum The Drizzle MySQL enum to extract values from
 * @returns Array of enum values as strings
 */
export const getEnumValues = (drizzleEnum: any): string[] => {
  const firstKey = Object.keys(drizzleEnum)[0];
  return drizzleEnum[firstKey].enumValues;
};
