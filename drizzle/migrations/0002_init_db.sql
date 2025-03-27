ALTER TABLE `property_amenities` ADD `amenity_id` varchar(20);--> statement-breakpoint
ALTER TABLE `property_amenities` ADD CONSTRAINT `property_amenities_amenity_id_amenity_aminity_id_fk` FOREIGN KEY (`amenity_id`) REFERENCES `amenity`(`aminity_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_amenities` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `property_amenities` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `property_amenities` DROP COLUMN `icon`;