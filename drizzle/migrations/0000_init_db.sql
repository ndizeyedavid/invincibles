CREATE TABLE `bookings` (
	`booking_id` varchar(255) NOT NULL,
	`property_id` varchar(255) NOT NULL,
	`renter_id` varchar(255) NOT NULL,
	`check_in` timestamp NOT NULL,
	`check_out` timestamp NOT NULL,
	`booking_status` enum('PENDING','CONCERED','APPROVED') DEFAULT 'PENDING',
	`total_price` double(10,2) NOT NULL,
	`guest_count` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`canceled_at` timestamp,
	`cancel_reason` varchar(500),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `bookings_booking_id` PRIMARY KEY(`booking_id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`conversation_id` varchar(255) NOT NULL,
	`host_id` varchar(255) NOT NULL,
	`renter_id` varchar(255) NOT NULL,
	`property_id` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `conversations_conversation_id` PRIMARY KEY(`conversation_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`message_id` varchar(255) NOT NULL,
	`conversation_id` varchar(255) NOT NULL,
	`sender_id` varchar(255) NOT NULL,
	`content` varchar(2000) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`is_read` boolean DEFAULT false,
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `messages_message_id` PRIMARY KEY(`message_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`notification_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` varchar(1000) NOT NULL,
	`is_read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`payment_id` varchar(255) NOT NULL,
	`booking_id` varchar(255) NOT NULL,
	`amount` double(10,2) NOT NULL,
	`payment_status` varchar(20) NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`transaction_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `payments_payment_id` PRIMARY KEY(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`property_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(2000) NOT NULL,
	`price_per_night` double(10,2) NOT NULL,
	`location` varchar(255) NOT NULL,
	`host_id` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`max_guests` int NOT NULL,
	`bathrooms` int NOT NULL,
	`latitude` double(10,8),
	`longitude` double(11,8),
	`bedrooms` int NOT NULL,
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `properties_property_id` PRIMARY KEY(`property_id`)
);
--> statement-breakpoint
CREATE TABLE `property_amenities` (
	`propertyAmenity_id` varchar(255) NOT NULL,
	`property_id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(50) NOT NULL,
	`icon` varchar(255),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `property_amenities_propertyAmenity_id` PRIMARY KEY(`propertyAmenity_id`)
);
--> statement-breakpoint
CREATE TABLE `property_images` (
	`image_id` varchar(255) NOT NULL,
	`property_id` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`is_primary` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `property_images_image_id` PRIMARY KEY(`image_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`review_id` varchar(255) NOT NULL,
	`property_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`booking_id` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` varchar(1000),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `reviews_review_id` PRIMARY KEY(`review_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`avatar` varchar(255),
	`role` enum('RENTER','HOSTER') DEFAULT 'RENTER',
	`google_id` varchar(255),
	`is_verified` boolean DEFAULT false,
	`phone_number` varchar(20),
	`password` varchar(255),
	`password_changed_at` timestamp,
	`password_reset_experis_in` timestamp,
	`password_reset_token` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	`deleted_at` timestamp,
	`status` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_property_id_properties_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_renter_id_users_user_id_fk` FOREIGN KEY (`renter_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_host_id_users_user_id_fk` FOREIGN KEY (`host_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_renter_id_users_user_id_fk` FOREIGN KEY (`renter_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_property_id_properties_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_conversations_conversation_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`conversation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_users_user_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_bookings_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_host_id_users_user_id_fk` FOREIGN KEY (`host_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_amenities` ADD CONSTRAINT `property_amenities_property_id_properties_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_images` ADD CONSTRAINT `property_images_property_id_properties_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_property_id_properties_property_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_booking_id_bookings_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE no action ON UPDATE no action;