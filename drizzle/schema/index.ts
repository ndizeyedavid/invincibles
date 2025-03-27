import { relations } from "drizzle-orm";
import {
  mysqlEnum,
  mysqlTable,
  varchar,
  timestamp,
  date,
  boolean,
  double,
  int,
} from "drizzle-orm/mysql-core";
import { integer, jsonb, numeric } from "drizzle-orm/pg-core";
import { string } from "joi";
/**
 * ********************* start of enum *****************************
 */

export const DefaultStatusEnum = mysqlEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "DELETED",
]);

export const BookingStatusEnum = mysqlEnum("booking_status", [
  "PENDING",
  "CONCERED",
  "APPROVED",
]);
export const GenderEnum = mysqlEnum("gender", ["MALE", "FEMALE"]);
export const Role = mysqlEnum("role", ["RENTER", "HOSTER"]);

/**
 * users table
 */
export const usersTable = mysqlTable("users", {
  user_id: varchar("user_id", { length: 255 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  role: Role.default("RENTER"),
  google_id: varchar("google_id", { length: 255 }).unique(),
  isVerified: boolean("is_verified").default(false),
  phoneNumber: varchar("phone_number", { length: 20 }),
  password: varchar("password", { length: 255 }),
  password_changed_at: timestamp("password_changed_at"),
  password_reset_experis_in: timestamp("password_reset_experis_in"),
  password_reset_token: varchar("password_reset_token", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});
export const propertiesTable = mysqlTable("properties", {
  property_id: varchar("property_id", { length: 255 }).notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  pricePerNight: double("price_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  host_id: varchar("host_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  maxGuests: int("max_guests").notNull(),
  bathrooms: int("bathrooms").notNull(),
  latitude: double("latitude", { precision: 10, scale: 8 }),
  longitude: double("longitude", { precision: 11, scale: 8 }),
  bedrooms: int("bedrooms").notNull(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const propertyAmenitiesTable = mysqlTable("property_amenities", {
  propertyAmenity_id: varchar("propertyAmenity_id", { length: 255 })
    .primaryKey()
    .notNull(),
  property_id: varchar("property_id", { length: 255 })
    .references(() => propertiesTable.property_id)
    .notNull(),

  amenity_id: varchar("amenity_id", { length: 20 }).references(
    () => amenityTable.id
  ),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const propertyImagesTable = mysqlTable("property_images", {
  image_id: varchar("image_id", { length: 255 }).primaryKey().notNull(),
  property_id: varchar("property_id", { length: 255 })
    .references(() => propertiesTable.property_id)
    .notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const bookingsTable = mysqlTable("bookings", {
  booking_id: varchar("booking_id", { length: 255 }).primaryKey().notNull(),
  property_id: varchar("property_id", { length: 255 })
    .references(() => propertiesTable.property_id)
    .notNull(),
  renter_id: varchar("renter_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  booking_status: BookingStatusEnum.default("PENDING"),
  totalPrice: double("total_price", { precision: 10, scale: 2 }).notNull(),
  guestCount: int("guest_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  canceledAt: timestamp("canceled_at"),
  cancelReason: varchar("cancel_reason", { length: 500 }),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const reviewsTable = mysqlTable("reviews", {
  review_id: varchar("review_id", { length: 255 }).primaryKey().notNull(),
  property_Id: varchar("property_id", { length: 255 })
    .references(() => propertiesTable.property_id)
    .notNull(),
  user_id: varchar("user_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  booking_id: varchar("booking_id", { length: 255 })
    .references(() => bookingsTable.booking_id)
    .notNull(),
  rating: int("rating").notNull(),
  comment: varchar("comment", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const conversationsTable = mysqlTable("conversations", {
  conversation_id: varchar("conversation_id", { length: 255 })
    .primaryKey()
    .notNull(),
  host_id: varchar("host_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  renter_id: varchar("renter_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  property_id: varchar("property_id", { length: 255 })
    .references(() => propertiesTable.property_id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const messagesTable = mysqlTable("messages", {
  message_id: varchar("message_id", { length: 255 }).primaryKey().notNull(),
  conversation_id: varchar("conversation_id", { length: 255 })
    .references(() => conversationsTable.conversation_id)
    .notNull(),
  senderId: varchar("sender_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  content: varchar("content", { length: 2000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const notificationsTable = mysqlTable("notifications", {
  notification_id: varchar("notification_id", { length: 255 })
    .primaryKey()
    .notNull(),
  user_id: varchar("user_id", { length: 255 })
    .references(() => usersTable.user_id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 1000 }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const paymentsTable = mysqlTable("payments", {
  payment_id: varchar("payment_id", { length: 255 }).primaryKey().notNull(),
  booking_id: varchar("booking_id", { length: 255 })
    .references(() => bookingsTable.booking_id)
    .notNull(),
  amount: double("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: varchar("payment_status", { length: 20 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  transaction_id: varchar("transaction_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  status: DefaultStatusEnum.default("ACTIVE"),
});

export const amenityTable = mysqlTable("amenity", {
  id: varchar("aminity_id", { length: 20 }).primaryKey().notNull(),
  name: varchar("name", { length: 244 }).notNull(),
  amenityCode: varchar("aminity_category", { length: 20 }).notNull(),
});

export const aminityCategoryTable = mysqlTable("aminity_category", {
  id: varchar("code", { length: 20 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

//************************** Relations ***************************** */

export const propetiesTableRelations = relations(
  propertiesTable,
  ({ one, many }) => {
    return {
      host_id: one(usersTable, {
        fields: [propertiesTable.host_id],
        references: [usersTable.user_id],
      }),
      villages: many(propertyAmenitiesTable),
    };
  }
);
